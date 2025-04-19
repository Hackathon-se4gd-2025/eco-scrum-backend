import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { SusafService } from './susaf.service';

@Controller('susaf')
export class SusafController {
  constructor(private readonly susafService: SusafService) {}

  /**
   * Fetch and store sustainability effects from SuSAF API
   * @returns Success message with stored effects
   */
  @Post('effects')
  async fetchEffects() {
    return this.susafService.fetchAndStoreSustainabilityEffects();
  }

  /**
   * Fetch and store AI-generated recommendations from SuSAF API
   * @returns Success message with stored recommendations
   */
  @Post('recommendations')
  async fetchRecommendations() {
    return this.susafService.fetchAndStoreRecommendations();
  }

  /**
   * Generate backlog items from AI based on recommendations
   */
  @Post('generate-items/:projectId')
  async generateItemsFromRecommendations(@Param('projectId') projectId: string) {
    return this.susafService.generateItemsFromRecommendations(projectId);
  }

  /**
   * Save API token for a specific project
   * @param projectId The project identifier
   * @param body Object containing the API token
   * @returns Success message with stored token details
   */
  @Post('token/:projectId')
  async saveApiToken(
    @Param('projectId') projectId: string,
    @Body() body: { token: string }
  ) {
    //return this.susafService.saveApiToken(projectId, body.token);
  }

  /**
   * Get API token for a specific project
   * @param projectId The project identifier
   * @returns The API token information for the project
   */
  @Get('token/:projectId')
  async getApiToken(@Param('projectId') projectId: string) {
    //return this.susafService.getApiToken(projectId);
  }
}