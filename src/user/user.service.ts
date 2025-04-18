import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
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
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = new this.userModel({
      ...userData,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userModel.findOneAndUpdate({ id }, updateData, { new: true }).exec();
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const res = await this.userModel.deleteOne({ id }).exec();
    return { deleted: res.deletedCount > 0 };
  }

  // Find users by email
  async findByEmail(email: string): Promise<User[]> {
    return this.userModel.find({ email }).exec(); // Useful for user listing, etc.
  }

  async findOneByEmailWithPassword(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
  
}
