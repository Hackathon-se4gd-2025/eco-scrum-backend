import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { PRIORITY_LEVELS, TASK_STATUSES } from '../constants';

export type ItemDocument = Item & Document;

@Schema({ timestamps: true })
export class Item {
  @ApiProperty({ description: 'Title of the item', type: String })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Description of the item', type: String })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Priority level of the item', type: String, enum: PRIORITY_LEVELS })
  @Prop({ enum: PRIORITY_LEVELS })
  priority: string;

  @ApiProperty({ description: 'Status of the item', type: String, enum: TASK_STATUSES })
  @Prop({ enum: TASK_STATUSES })
  status: string;

  @ApiProperty({ description: 'Project ID the item belongs to', type: String })
  @Prop({ required: true, index: true })
  projectId: string;

  @ApiProperty({ description: 'Whether the item is sustainable', type: Boolean })
  @Prop({ default: false })
  sustainable: boolean;

  @ApiProperty({ description: 'Story points associated with the item', type: Number })
  @Prop()
  storyPoints: number;

  @ApiProperty({ description: 'Sustainability points for the item', type: Number, required: false })
  @Prop()
  sustainabilityPoints?: number;

  @ApiProperty({ description: 'User ID assigned to the item', type: String, required: false })
  @Prop()
  assignedTo?: string;

  @ApiProperty({ description: 'Sprint ID the item belongs to', type: String, required: false })
  @Prop()
  sprintId?: string;

  @ApiProperty({ description: 'Related SUSAF effects for the item', type: [String], required: false })
  @Prop({ type: [String] })
  relatedSusafEffects?: string[];

  @ApiProperty({ description: 'Definition of Done for the item', type: String, required: false })
  @Prop()
  definitionOfDone?: string;

  @ApiProperty({ description: 'Tags associated with the item', type: [String], required: false })
  @Prop({ type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Sustainability context of the item', type: String, required: false })
  @Prop()
  sustainabilityContext?: string;

  @ApiProperty({ description: 'Number of comments associated with the item', type: Number, required: false })
  @Prop({ default: 0 })
  comments?: number;

  @ApiProperty({ description: 'Number of subtasks related to the item', type: Number, required: false })
  @Prop({ default: 0 })
  subtasks?: number;

  @ApiProperty({ description: 'Order in which the item appears', type: Number, required: false })
  @Prop()
  order?: number;
}

export const ItemSchema = SchemaFactory.createForClass(Item);

ItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // copy _id to id
    delete ret._id; // remove _id
  },
});