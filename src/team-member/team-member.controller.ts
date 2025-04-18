import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TeamMember } from './team-member.schema';

@ApiTags('teamMembers')
@Controller('team-members')
export class TeamMemberController {
  constructor(private readonly teamMemberService: TeamMemberService) {}

  @ApiOperation({ summary: 'Get all team members' })
  @ApiResponse({ status: 200, description: 'List of team members', type: [TeamMember] })
  @Get()
  findAll() {
    return this.teamMemberService.findAll();
  }

  @ApiOperation({ summary: 'Get team member by ID' })
  @ApiResponse({ status: 200, description: 'Team member details', type: TeamMember })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.teamMemberService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new team member' })
  @ApiResponse({ status: 201, description: 'Team member created', type: TeamMember })
  @Post()
  create(@Body() createTeamMemberDto: TeamMember) {
    return this.teamMemberService.create(createTeamMemberDto);
  }

  @ApiOperation({ summary: 'Update team member by ID' })
  @ApiResponse({ status: 200, description: 'Updated team member', type: TeamMember })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTeamMemberDto: TeamMember) {
    return this.teamMemberService.update(id, updateTeamMemberDto);
  }

  @ApiOperation({ summary: 'Delete team member by ID' })
  @ApiResponse({ status: 200, description: 'Team member deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.teamMemberService.remove(id);
  }
}
