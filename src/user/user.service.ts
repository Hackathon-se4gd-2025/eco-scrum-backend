import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findOne({ id }).exec();
  }

  async create(userData: User): Promise<User> {
    const createdUser = new this.userModel(userData);
    return createdUser.save();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.userModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }
}