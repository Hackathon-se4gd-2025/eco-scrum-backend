import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import * as dotenv from 'dotenv';
import { OpenAI } from 'openai';
import { Project } from 'src/projects/projects.schema';
import { SustainabilityEffect, EffectDetail, Recommendation, ProjectApiToken } from './susaf.schema';
import { Item } from 'src/item/item.schema'; // Add this import
import { PRIORITY_LEVELS, TASK_STATUSES } from 'src/constants';

dotenv.config(); // ✅ Load environment variables from .env

@Injectable()
export class SusafService {
  private readonly API_BASE_URL = process.env.SUSAF_API_URL;
  private readonly API_TOKEN = process.env.SUSAF_API_TOKEN;
  private readonly logger = new Logger(SusafService.name);
  private readonly openai: OpenAI;

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(SustainabilityEffect.name) private readonly effectModel: Model<SustainabilityEffect>,
    @InjectModel(EffectDetail.name) private readonly effectDetailModel: Model<EffectDetail>,
    @InjectModel(Recommendation.name) private readonly recommendationModel: Model<Recommendation>,
    @InjectModel(Item.name) private readonly itemModel: Model<Item>, // Changed from BacklogItem to Item
    @InjectModel(Project.name) private readonly projectModel: Model<Project>,
    @InjectModel(ProjectApiToken.name) private readonly projectApiTokenModel: Model<ProjectApiToken>
  ) {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateItemsFromRecommendations(projectId: string): Promise<any> {
    try {
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        throw new Error('Project not found');
      }
      this.logger.log(`Generating items for project: ${project.name} (${projectId})`);
      this.logger.log('Fetching recommendations from the database');

      // Fetch stored recommendations for this specific project
      const recommendations = await this.recommendationModel.find({ projectId });

      if (!recommendations.length) {
        throw new Error(`No recommendations found for project ${projectId}.`);
      }

      // Extract recommendation texts
      const recommendationTexts = recommendations.map(rec => Object.values(rec.recommendations)).flat();
      const threats = recommendations.map(rec => Object.values(rec.threats)).flat();
      const opportunities = recommendations.map(rec => Object.values(rec.opportunities)).flat();

      // Prepare prompt
      const prompt = `
Given the following sustainability recommendations, threats and opportunities, generate three structured backlog items.

Recommendations:
${recommendationTexts.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Threats:
${threats.map((threat, index) => `${index + 1}. ${threat}`).join('\n')}

Opportunities:
${opportunities.map((opp, index) => `${index + 1}. ${opp}`).join('\n')}

For each backlog item, provide:
- title (string)
- description (string)
- priority (string, one of: ["Low", "Medium", "High"])
- storyPoints (integer)
- sustainabilityPoints (integer, optional)
- definitionOfDone (string, optional)
- sustainabilityContext (string, optional)

Return the output as a JSON object with an "items" field containing an array of backlog items, matching the schema provided.
`;

      // OpenAI API call
      const completion = await this.openai.chat.completions.create({
        model: "gpt-4o-2024-08-06",
        messages: [
          { role: "user", content: prompt }
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "Items",
            strict: true,
            schema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      title: { type: "string" },
                      description: { type: "string" },
                      priority: { type: "string", enum: ["Low", "Medium", "High"] },
                      storyPoints: { type: "integer" },
                      sustainabilityPoints: { type: "integer" },
                      definitionOfDone: { type: "string" },
                      sustainabilityContext: { type: "string" },
                    },
                    required: [
                      "title",
                      "description",
                      "priority",
                      "storyPoints",
                      "sustainabilityPoints",
                      "sustainabilityContext",
                      "definitionOfDone"
                    ],
                    additionalProperties: false
                  }
                }
              },
              required: ["items"],
              additionalProperties: false
            }
          }
        },
        temperature: 0.7
      });

      this.logger.log('OpenAI Response:', completion);

      if (!completion.choices[0].message.content) {
        throw new Error('No content received from OpenAI');
      }
      const responseContent = JSON.parse(completion.choices[0].message.content);

      // Transform and save items using the Item model instead of BacklogItem
      // Add the "AI Generated: " prefix to titles and ensure no sprint assignment
      const items = await this.itemModel.insertMany(
        responseContent.items.map(item => ({
          title: `AI Generated: ${item.title}`, // Add prefix to title
          description: item.description,
          priority: item.priority,
          sustainable: true,
          storyPoints: item.storyPoints,
          sustainabilityPoints: item.sustainabilityPoints || undefined,
          status: "To Do",
          projectId: projectId,
          // No sprintId assigned
          relatedSusafEffects: [],
          definitionOfDone: item.definitionOfDone || "",
          tags: [],
          sustainabilityContext: item.sustainabilityContext || "",
        }))
      );

      return { message: 'Items generated and saved successfully', items };

    } catch (error) {
      this.logger.error(`Error generating items from recommendations: ${error.message}`);
      throw new Error(`Failed to generate items from recommendations: ${error.message}`);
    }
  }

  async fetchAndStoreSustainabilityEffects(projectId: string): Promise<any> {
    try {
      // First check if we have a token for this project
      const apiTokenDoc = await this.projectApiTokenModel.findOne({ projectId });
      if (!apiTokenDoc) {
        throw new Error(`No API token found for project ${projectId}`);
      }

      const token = apiTokenDoc.token;

      
      // Use token in URL path, like in the recommendations method
      const url = `${this.API_BASE_URL}/effects/${token}`;
      this.logger.log(`Fetching Sustainability Effects for project ${projectId} from: ${url}`);

      // Keep it consistent with your recommendations method
      const response = await firstValueFrom(this.httpService.post(url));
      
      if (!response || !response.data) {
        throw new Error('No response received from the API');
      }

      const data = response.data;

      // Process and Save Effects
      const effectDocuments = await Promise.all(
        data.effects.map(async (effect) => {
          // Process Effect Details
          const effectDetails = await Promise.all(
            effect.effects.map(async (detail) => {
              // ✅ Check if effect detail exists
              const existingEffectDetail = await this.effectDetailModel.findOne({ external_id: detail.id });

              if (existingEffectDetail) {
                // ✅ Update existing effect detail
                return await this.effectDetailModel.findOneAndUpdate(
                  { external_id: detail.id },
                  {
                    description: detail.description,
                    is_positive: detail.is_positive,
                    likelihood: detail.likelihood,
                    impact_level: detail.impact_level,
                    order_of_impact: detail.order_of_impact,
                    dimension_name: detail.dimension_name,
                    dimension_id: detail.dimension_id,
                    createdAt: new Date(detail.created_at),
                    updatedAt: new Date(detail.updated_at),
                    added_by_username: detail.added_by_username,
                    added_by_email: detail.added_by_email,
                    related_feature: detail.related_feature || null,
                    projectId,
                  },
                  { new: true }
                );
              } else {
                // ✅ Create new effect detail if it doesn't exist
                return await this.effectDetailModel.create({
                  external_id: detail.id,
                  description: detail.description,
                  is_positive: detail.is_positive,
                  likelihood: detail.likelihood,
                  impact_level: detail.impact_level,
                  order_of_impact: detail.order_of_impact,
                  dimension_name: detail.dimension_name,
                  dimension_id: detail.dimension_id,
                  createdAt: new Date(detail.created_at),
                  updatedAt: new Date(detail.updated_at),
                  added_by_username: detail.added_by_username,
                  added_by_email: detail.added_by_email,
                  related_feature: detail.related_feature || null,
                  projectId,
                });
              }
            })
          );

          // ✅ Check if the main effect exists
          const existingEffect = await this.effectModel.findOne({ external_id: effect.id });

          if (existingEffect) {
            // ✅ Update existing effect
            return await this.effectModel.findOneAndUpdate(
              { external_id: effect.id },
              {
                name: effect.name,
                question: effect.question,
                capture_id: effect.capture_id,
                created_at: new Date(effect.created_at),
                effects: effectDetails.map((detail) => detail),
                projectId,
              },
              { new: true }
            );
          } else {
            // ✅ Create new effect if it doesn't exist
            return await this.effectModel.create({
              external_id: effect.id,
              name: effect.name,
              question: effect.question,
              capture_id: effect.capture_id,
              created_at: new Date(effect.created_at),
              effects: effectDetails.map((detail) => detail),
              projectId,
            });
          }
        })
      );

      return { message: 'Sustainability effects saved successfully', effects: effectDocuments };
    } catch (error) {
      this.logger.error(`Error fetching sustainability effects: ${error.message}`);
      throw new Error(`Failed to fetch and save sustainability effects: ${error.message}`);
    }
  }

  async fetchAndStoreRecommendations(projectId: string): Promise<any> {
    try {
      // First check if we have a token for this project
      const apiTokenDoc = await this.projectApiTokenModel.findOne({ projectId });
      if (!apiTokenDoc) {
        throw new Error(`No API token found for project ${projectId}`);
      }

      const token = apiTokenDoc.token;

      // Fetch Recommendations Data using the project-specific token
      const url = `${this.API_BASE_URL}/recommendations/${token}`;
      this.logger.log(`Fetching Recommendations for project ${projectId} from: ${url}`);

      const response = await firstValueFrom(this.httpService.post(url));
      if (!response || !response.data) {
        throw new Error('No response received from the API');
      }

      const data = response.data;

      // Process and Save Recommendations
      const recommendationDocuments = await Promise.all(
        Object.values(data.synthesis).map((rec: any) =>
          this.recommendationModel.create({
            threats: rec.recommendation.threats,
            opportunities: rec.recommendation.opportunities,
            recommendations: rec.recommendation.recommendations,
            projectId,
          })
        )
      );

      return { message: 'Recommendations saved successfully', recommendations: recommendationDocuments };
    } catch (error) {
      this.logger.error(`Error fetching recommendations: ${error.message}`);
      throw new Error(`Failed to fetch and save recommendations: ${error.message}`);
    }
  }

  /**
   * Save API token for a project
   * @param projectId The project identifier
   * @param token The API token to save
   * @returns The saved token information
   */
  async saveApiToken(projectId: string, token: string) {
    try {
      this.logger.log(`Saving API token for project: ${projectId}`);

      // Check if the project exists
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        this.logger.error(`Project with ID ${projectId} not found`);
        return {
          success: false,
          message: 'Project not found'
        };
      }

      // Use upsert to either create or update the token
      const result = await this.projectApiTokenModel.findOneAndUpdate(
        { projectId },
        { projectId, token },
        { upsert: true, new: true }
      );

      this.logger.log(`API token saved successfully for project: ${projectId}`);

      return {
        success: true,
        message: 'API token saved successfully',
        data: {
          projectId: result.projectId,
        }
      };
    } catch (error) {
      this.logger.error(`Error saving API token: ${error.message}`);
      return {
        success: false,
        message: `Failed to save API token: ${error.message}`
      };
    }
  }

  /**
   * Get API token for a project
   * @param projectId The project identifier
   * @returns The token information
   */
  async getApiToken(projectId: string) {
    try {
      this.logger.log(`Retrieving API token for project: ${projectId}`);

      // Check if the project exists
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        this.logger.error(`Project with ID ${projectId} not found`);
        return {
          success: false,
          message: 'Project not found'
        };
      }

      const token = await this.projectApiTokenModel.findOne({ projectId });

      if (!token) {
        this.logger.warn(`No API token found for project: ${projectId}`);
        return {
          success: false,
          message: 'No API token found for this project'
        };
      }

      return {
        success: true,
        data: {
          projectId: token.projectId,
          token: token.token,
        }
      };
    } catch (error) {
      this.logger.error(`Error retrieving API token: ${error.message}`);
      return {
        success: false,
        message: `Failed to retrieve API token: ${error.message}`
      };
    }
  }

  /**
   * Get sustainability effects for a project
   * @param projectId The project identifier
   * @returns The sustainability effects for the project
   */
  async getSustainabilityEffects(projectId: string) {
    try {
      this.logger.log(`Getting sustainability effects for project: ${projectId}`);

      // Check if the project exists
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        this.logger.error(`Project with ID ${projectId} not found`);
        return {
          success: false,
          message: 'Project not found'
        };
      }

      // Find all sustainability effects for this project
      const effects = await this.effectModel.find({ projectId })
        .populate('effects')
        .exec();

      if (!effects || effects.length === 0) {
        return {
          success: true,
          message: 'No sustainability effects found for this project',
          data: []
        };
      }

      return {
        success: true,
        data: effects
      };
    } catch (error) {
      this.logger.error(`Error retrieving sustainability effects: ${error.message}`);
      return {
        success: false,
        message: `Failed to retrieve sustainability effects: ${error.message}`
      };
    }
  }

  /**
   * Get recommendations for a project
   * @param projectId The project identifier
   * @returns The recommendations for the project
   */
  async getRecommendations(projectId: string) {
    try {
      this.logger.log(`Getting recommendations for project: ${projectId}`);

      // Check if the project exists
      const project = await this.projectModel.findById(projectId);
      if (!project) {
        this.logger.error(`Project with ID ${projectId} not found`);
        return {
          success: false,
          message: 'Project not found'
        };
      }

      // Find all recommendations for this project
      const recommendations = await this.recommendationModel.find({ projectId });

      if (!recommendations || recommendations.length === 0) {
        return {
          success: true,
          message: 'No recommendations found for this project',
          data: []
        };
      }

      return {
        success: true,
        data: recommendations
      };
    } catch (error) {
      this.logger.error(`Error retrieving recommendations: ${error.message}`);
      return {
        success: false,
        message: `Failed to retrieve recommendations: ${error.message}`
      };
    }
  }
}