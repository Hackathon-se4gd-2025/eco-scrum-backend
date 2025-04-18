import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
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

  @ApiOperation({ summary: 'Add team member to a project' })
@ApiResponse({ status: 201, description: 'Team member added to project' })
@Post(':projectId/team-members')
async addTeamMember(
  @Param('projectId') projectId: string,
  @Body() newTeamMember: { userId: string; email: string; role: string },
) {
  return this.projectService.addTeamMemberToProject(projectId, newTeamMember);
}

@Patch(':id')
@ApiOperation({ summary: 'Patch project by ID (partial update)' })
@ApiResponse({ status: 200, description: 'Partially updated project', type: Project })
patchProject(@Param('id') id: string, @Body() partialUpdateDto: Partial<Project>) {
  return this.projectService.update(id, partialUpdateDto);
}
}
