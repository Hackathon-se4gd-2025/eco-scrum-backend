import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true }) // Auto-generated ObjectId
  id: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'The name of the user' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Description of the user' })
  email: string;

  @Prop()
  @ApiProperty({ description: 'Avatar of the user' })
  avatar?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
