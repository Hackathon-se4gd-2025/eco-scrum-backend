import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  @ApiProperty({ description: 'The name of the user' })
  name: string;

  @Prop({ required: true })
  @ApiProperty({ description: 'Description of the user' })
  email: string;

  @Prop()
  @ApiProperty({ description: 'Avatar of the user' })
  avatar?: string;

  @Prop({ required: true, select: false }) // select: false makes sure it's not returned by default
@ApiProperty({ description: 'Hashed password of the user' })
password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // copy _id to id
    delete ret._id;              // remove _id
  },
});