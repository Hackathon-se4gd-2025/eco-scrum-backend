import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint, SprintDocument } from './sprint.schema';

@Injectable()
export class SprintService {
  constructor(@InjectModel(Sprint.name) private sprintModel: Model<SprintDocument>) {}

  // Get all sprints
  async findAll(): Promise<Sprint[]> {
    return this.sprintModel.find().exec();
  }

  // Get sprint by ID
  async findOne(id: string): Promise<Sprint | null > {
    return this.sprintModel.findOne({ id }).exec();
  }

  // Create a new sprint
  async create(data: any): Promise<Sprint> {
    const createdSprint = new this.sprintModel(data);
    return createdSprint.save();
  }

  // Update sprint by ID
  async update(id: string, updateData: any): Promise<Sprint | null > {
    return this.sprintModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  // Delete sprint by ID
  async remove(id: string): Promise<any | null > {
    return this.sprintModel.findOneAndDelete({ id }).exec();
  }
}
