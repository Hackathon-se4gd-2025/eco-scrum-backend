// task/task.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task, TaskDocument } from './task.schema'; // Import Task schema

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>, // Inject the Task model
  ) { }

  // Get all tasks
  async findAll() {
    return this.taskModel.find().exec(); // Retrieve all tasks from MongoDB
  }

  // Get a task by ID
  async findOne(id: string) {
    return this.taskModel.findById(id).exec(); // Retrieve a task by ID
  }

  // Create a new task
  async create(data: any) {
    const task = new this.taskModel(data); // Create a new instance of the Task model
    return task.save(); // Save to MongoDB
  }

  // Update an existing task
  async update(id: string, updateData: any) {
    return this.taskModel.findByIdAndUpdate(id, updateData, { new: true }).exec(); // Update task and return updated document
  }

  // Delete a task
  async remove(id: string) {
    return this.taskModel.findByIdAndDelete(id).exec(); // Delete the task by ID
  }
}
