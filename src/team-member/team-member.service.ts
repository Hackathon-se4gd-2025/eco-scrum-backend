// team-member/team-member.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TeamMember, TeamMemberDocument } from './team-member.schema'; // Import TeamMember schema

@Injectable()
export class TeamMemberService {
  constructor(
    @InjectModel(TeamMember.name) private teamMemberModel: Model<TeamMemberDocument>, // Inject the TeamMember model
  ) {}

  // Get all team members
  async findAll() {
    return this.teamMemberModel.find().exec(); // Retrieve all team members from MongoDB
  }

  // Get a team member by ID
  async findOne(id: string) {
    return this.teamMemberModel.findById(id).exec(); // Retrieve a team member by ID
  }

  // Create a new team member
  async create(data: any) {
    const teamMember = new this.teamMemberModel(data); // Create a new instance of the TeamMember model
    return teamMember.save(); // Save to MongoDB
  }

  // Update an existing team member
  async update(id: string, updateData: any) {
    return this.teamMemberModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // Update team member and return updated document
  }

  // Delete a team member
  async remove(id: string) {
    return this.teamMemberModel.findByIdAndDelete(id).exec(); // Delete the team member by ID
  }
}
