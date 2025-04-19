import { Controller, Post, Body, Param, Get, BadRequestException } from '@nestjs/common';
import { SusafService } from './susaf.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

interface TokenDto {
  token: string;
}

@ApiTags('susaf')
@Controller('susaf')
export class SusafController {
  constructor(private readonly susafService: SusafService) {}

  /**
   * Fetch and store sustainability effects from SuSAF API
   * @returns Success message with stored effects
   */
  @Post('effects/:projectId')
  @ApiParam({ name: 'projectId', description: 'Project identifier' })
  async fetchEffects(@Param('projectId') projectId: string) {
    return this.susafService.fetchAndStoreSustainabilityEffects(projectId);
  }

  /**
   * Fetch and store AI-generated recommendations from SuSAF API
   * @returns Success message with stored recommendations
   */
  @Post('recommendations/:projectId')
  @ApiParam({ name: 'projectId', description: 'Project identifier' })
  async fetchRecommendations(@Param('projectId') projectId: string) {
    return this.susafService.fetchAndStoreRecommendations(projectId);
  }

  /**
   * Generate backlog items from AI based on recommendations
   */
  @Post('generate-items/:projectId')
  @ApiParam({ name: 'projectId', description: 'Project identifier' })
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
  @ApiParam({ name: 'projectId', description: 'Project identifier' })
  @ApiBody({ 
    description: 'API token for the project',
    type: 'object',
    schema: {
      properties: {
        token: { type: 'string' }
      }
    }
  })
  async saveApiToken(
    @Param('projectId') projectId: string,
    @Body() body: TokenDto
  ) {
    if (!body || !body.token) {
      throw new BadRequestException('Token is required');
    }
    return this.susafService.saveApiToken(projectId, body.token);
  }

  /**
   * Get API token for a specific project
   * @param projectId The project identifier
   * @returns The API token information for the project
   */
  @Get('token/:projectId')
  @ApiParam({ name: 'projectId', description: 'Project identifier' })
  async getApiToken(@Param('projectId') projectId: string) {
    return this.susafService.getApiToken(projectId);
  }
}