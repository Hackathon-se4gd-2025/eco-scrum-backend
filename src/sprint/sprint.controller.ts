import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Sprint } from './sprint.schema';

@ApiTags('sprints')
@Controller('sprints')
export class SprintController {
  constructor(private readonly sprintService: SprintService) { }

  @ApiOperation({ summary: 'Get all sprints' })
  @ApiResponse({ status: 200, description: 'List of sprints', type: [Sprint] })
  @Get()
  findAll() {
    return this.sprintService.findAll();
  }

  @ApiOperation({ summary: 'Get sprint by ID' })
  @ApiResponse({ status: 200, description: 'Sprint details', type: Sprint })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sprintService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new sprint' })
  @ApiResponse({ status: 201, description: 'Sprint created', type: Sprint })
  @Post()
  create(@Body() createSprintDto: Sprint) {
    return this.sprintService.create(createSprintDto);
  }

  @ApiOperation({ summary: 'Update sprint by ID' })
  @ApiResponse({ status: 200, description: 'Updated sprint', type: Sprint })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSprintDto: Sprint) {
    return this.sprintService.update(id, updateSprintDto);
  }

  @ApiOperation({ summary: 'Delete sprint by ID' })
  @ApiResponse({ status: 200, description: 'Sprint deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sprintService.remove(id);
  }

  @Patch(':id/retrospective')
  @ApiOperation({ summary: 'Update retrospective field for a sprint' })
  @ApiResponse({ status: 200, description: 'Retrospective updated', type: Sprint })
  updateRetrospective(
    @Param('id') id: string,
    @Body() updateData: {
      goalMet: 'Yes' | 'No' | 'Partially';
      inefficientProcesses: string;
      improvements: string;
      teamNotes: string;
    }
  ) {
    return this.sprintService.updateRetrospective(id, updateData);
  }
  @Patch(':id/complete')
  async completeSprint(@Param('id') id: string) {
    return this.sprintService.completeSprint(id);
  }
}
