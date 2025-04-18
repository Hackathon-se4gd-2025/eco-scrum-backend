import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { ProjectService } from './projects.service';

import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Project } from './projects.schema';

@ApiTags('projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'List of projects', type: [Project] })
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, description: 'Project details', type: Project })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'Project created', type: Project })
  @Post()
  create(@Body() createProjectDto: Project) {
    return this.projectService.create(createProjectDto);
  }

  @ApiOperation({ summary: 'Update project by ID' })
  @ApiResponse({ status: 200, description: 'Updated project', type: Project })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: Project) {
    return this.projectService.update(id, updateProjectDto);
  }

  @ApiOperation({ summary: 'Delete project by ID' })
  @ApiResponse({ status: 200, description: 'Project deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
