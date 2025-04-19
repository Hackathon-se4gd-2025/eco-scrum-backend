// backlog-item/backlog-item.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BacklogItem, BacklogItemDocument } from './backlog-item.schema'; // Import BacklogItem schema

@Injectable()
export class BacklogItemService {
  constructor(
    @InjectModel(BacklogItem.name) private backlogItemModel: Model<BacklogItemDocument>, // Inject the BacklogItem model
  ) { }

  // Get all backlog items
  async findAll() {
    return this.backlogItemModel.find().exec(); // Retrieve all backlog items from MongoDB
  }

  // Get a backlog item by ID
  async findOne(id: string) {
    return this.backlogItemModel.findById(id).exec(); // Retrieve a backlog item by ID
  }

  // Create a new backlog item
  async create(data: any) {
    const backlogItem = new this.backlogItemModel(data); // Create a new instance of the BacklogItem model
    return backlogItem.save(); // Save to MongoDB
  }

  // Update an existing backlog item
  async update(id: string, updateData: any) {
    return this.backlogItemModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // Update backlog item and return updated document
  }

  // Delete a backlog item
  async remove(id: string) {
    return this.backlogItemModel.findByIdAndDelete(id).exec(); // Delete the backlog item by ID
  }
}
