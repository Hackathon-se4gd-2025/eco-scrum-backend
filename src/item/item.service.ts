import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Item, ItemDocument } from './item.schema';
import { TASK_STATUSES } from '../constants';

@Injectable()
export class ItemService {
  constructor(
    @InjectModel(Item.name) private itemModel: Model<ItemDocument>,
  ) {}

  async findAll(): Promise<Item[]> {
    return this.itemModel.find().exec();
  }

  async findByProject(projectId: string): Promise<Item[]> {
    return this.itemModel.find({ projectId }).exec();
  }

  async findBySprint(sprintId: string): Promise<Item[]> {
    return this.itemModel.find({ sprintId }).exec();
  }

  async findByProjectAndSprint(projectId: string, sprintId: string): Promise<Item[]> {
    return this.itemModel.find({ projectId, sprintId }).exec();
  }

  async findOne(id: string): Promise<Item | null> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    return item;
  }

  async create(createItemDto: Item): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);
    return createdItem.save();
  }

  async update(id: string, updateItemDto: Partial<Item>): Promise<Item | null> {
    const updatedItem = await this.itemModel
      .findByIdAndUpdate(id, updateItemDto, { new: true })
      .exec();
    
    if (!updatedItem) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    return updatedItem;
  }

  async remove(id: string): Promise<{ deleted: boolean; message?: string }> {
    const result = await this.itemModel.deleteOne({ _id: id }).exec();
    
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    return { 
      deleted: result.deletedCount > 0,
      message: `Item with ID ${id} successfully deleted` 
    };
  }

  async assignToSprint(id: string, sprintId: string): Promise<Item | null> {
    const item = await this.itemModel.findById(id).exec();
    
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    item.sprintId = sprintId;
    return item.save();
  }

  async assignToUser(id: string, userId: string): Promise<Item | null> {
    const item = await this.itemModel.findById(id).exec();
    
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    item.assignedTo = userId;
    return item.save();
  }

  async updateStatus(id: string, status: string): Promise<Item | null> {
    if (!TASK_STATUSES.includes(status as any)) {
      throw new BadRequestException(`Invalid status: ${status}. Valid statuses are: ${TASK_STATUSES.join(', ')}`);
    }
    
    const item = await this.itemModel.findById(id).exec();
    
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }
    
    item.status = status;
    return item.save();
  }

  async getItemsStats(projectId: string) {
    const totalItems = await this.itemModel.countDocuments({ projectId }).exec();
    const completedItems = await this.itemModel.countDocuments({ 
      projectId, 
      status: 'Done' 
    }).exec();
    const sustainableItems = await this.itemModel.countDocuments({ 
      projectId, 
      sustainable: true 
    }).exec();
    
    return {
      total: totalItems,
      completed: completedItems,
      sustainable: sustainableItems,
      completionRate: totalItems > 0 ? (completedItems / totalItems) * 100 : 0,
      sustainabilityRate: totalItems > 0 ? (sustainableItems / totalItems) * 100 : 0,
    };
  }
}