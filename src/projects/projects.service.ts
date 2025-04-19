// project/project.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema'; // Import Project schema
import { Sprint, SprintDocument } from 'src/sprint/sprint.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>, // Inject the Project model
    @InjectModel(Sprint.name) private sprintModel: Model<SprintDocument>, // Inject the Sprint model
  ) {}

  // Get all projects
  async findAll() {
    const projects = this.projectModel.find().populate('teamMembers').exec();
    return projects;
  }

  // Get a project by ID
  async findOne(id: string) {
    return this.projectModel.findById(id).populate('teamMembers').exec();
  }

  // Create a new project
  async create(data: any) {
    const project = new this.projectModel(data); // Create a new instance of the model
    return project.save(); // Save to MongoDB
  }

  // Update an existing project
  async update(id: string, updateData: any) {
    return this.projectModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // Update the project
  }

  // Delete a project
  async remove(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec(); // Delete the project
  }

  // Add this inside your ProjectService class

async addTeamMemberToProject(
  projectId: string,
  newTeamMember: { userId: string; email: string; role: string }
) {
  const project = await this.projectModel.findById(projectId);
  if (!project) {
    throw new Error('Project not found');
  }

  // Check if user is already a member
  const isAlreadyMember = project.teamMembers.some(
    (member: any) => member.userId?.toString() === newTeamMember.userId
  );
  if (isAlreadyMember) {
    throw new Error('User is already part of the project');
  }

  // Add team member
  project.teamMembers.push({
    userId: newTeamMember.userId,
    email: newTeamMember.email,
    role: newTeamMember.role,
    joinedAt: new Date().toISOString(),
  });

  return await project.save();
}
async getSprintsByProjectId(projectId: string): Promise<Sprint[]> {
  // Check if the project exists
 
  const project = await this.projectModel.find( { _id: new mongoose.Types.ObjectId(projectId) });
  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found`);
  }

    // Fetch sprints with matching projectId
    return this.sprintModel.find({ projectId }).exec();
}

}
export { Project };

