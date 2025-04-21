import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Sprint, SprintDocument } from './sprint.schema';

@Injectable()
export class SprintService {
  constructor(@InjectModel(Sprint.name) private sprintModel: Model<SprintDocument>) { }

  // Get all sprints
  async findAll(): Promise<Sprint[]> {
    return this.sprintModel.find().exec();
  }

  // Get sprint by ID
  async findOne(id: string): Promise<Sprint | null> {
    return this.sprintModel.findById(id).exec();
  }

  // Create a new sprint
  async create(data: any): Promise<Sprint> {
    const createdSprint = new this.sprintModel(data);
    return createdSprint.save();
  }

  // Update sprint by ID
  async update(id: string, updateData: any): Promise<Sprint | null> {
    return this.sprintModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  // Delete sprint by ID
  async remove(id: string): Promise<any | null> {
    return this.sprintModel.findOneAndDelete({ id }).exec();
  }
  async updateRetrospective(id: string, retrospective: Sprint['retrospective']) {
    if (!id) {
      throw new Error('Sprint ID is required');
    }
    return this.sprintModel.findByIdAndUpdate(
      id,
      { retrospective },
      { new: true }
    ).exec();
  }

  async completeSprint(id: string) {
    const sprint = await this.sprintModel.findById(id);
    if (!sprint) {
      throw new NotFoundException('Sprint not found');
    }

    if (sprint.completed === true) {
      throw new BadRequestException('Sprint is already completed');
    }

    sprint.completed = true;
    sprint.endDate = new Date().toDateString(); // optional field if you want to track this
    await sprint.save();

    return { message: 'Sprint completed successfully', sprint };
  }

  async updateSprintData(
    sprintId: string,
    updateData: { items: string[]; sustainabilityScore: number },
  ): Promise<Sprint> {
    // Find the sprint by ID
    const sprint = await this.sprintModel.findById(sprintId);
    if (!sprint) {
      throw new NotFoundException(`Sprint with ID ${sprintId} not found`);
    }

    // Update the sprint with the new data
    sprint.items = updateData.items;
    sprint.sustainabilityScore = updateData.sustainabilityScore;

    // Save the updated sprint
    await sprint.save();

    return sprint;
  }

}
