// project/project.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './projects.schema'; // Import Project schema

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>, // Inject the Project model
  ) {}

  // Get all projects
  async findAll() {
    return this.projectModel.find().populate('teamMembers').exec(); // Populate teamMembers with full data
  }

  // Get a project by ID
  async findOne(id: string) {
    return this.projectModel.findById(id).populate('teamMembers').exec(); // Populate teamMembers with full data
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
}
export { Project };

