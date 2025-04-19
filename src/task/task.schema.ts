// task/schemas/task.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
  @ApiProperty({ description: 'Title of the task', type: String })
  @Prop()
  title: string;

  @ApiProperty({ description: 'Description of the task', type: String })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Priority of the task', type: String })
  @Prop()
  priority: string;

  @ApiProperty({ description: 'Sustainability context of the task', type: String })
  @Prop()
  sustainabilityContext: string;

  @ApiProperty({ description: 'Status of the task', type: String })
  @Prop()
  status: string;

  @ApiProperty({ description: 'Number of comments associated with the task', type: Number })
  @Prop()
  comments: number;

  @ApiProperty({ description: 'Number of subtasks related to the task', type: Number })
  @Prop()
  subtasks: number;

  @ApiProperty({ description: 'Sustainability weight of the task', type: Number })
  @Prop()
  sustainabilityWeight: number;

  @ApiProperty({ description: 'User ID assigned to the task', type: String, required: false })
  @Prop()
  assignedTo?: string;

  @ApiProperty({ description: 'Sprint ID the task belongs to', type: String })
  @Prop()
  sprintId: string;

  @ApiProperty({ description: 'Story points associated with the task', type: Number })
  @Prop()
  storyPoints: number;

  @ApiProperty({ description: 'Sustainability points for the task', type: Number })
  @Prop()
  sustainabilityPoints: number;

  @ApiProperty({ description: 'Related SUSAF effects for the task', type: [String], required: false })
  @Prop({ type: [String] })
  relatedSusafEffects?: string[];

  @ApiProperty({ description: 'Definition of Done for the task', type: String, required: false })
  @Prop()
  definitionOfDone?: string;

  @ApiProperty({ description: 'Tags associated with the task', type: [String], required: false })
  @Prop({ type: [String] })
  tags?: string[];

  @ApiProperty({ description: 'Whether the task is sustainable', type: Boolean })
  @Prop()
  sustainable: boolean;

  @ApiProperty({ description: 'SUSAF category associated with the task', type: String, required: false })
  @Prop()
  susafCategory?: string;

  @ApiProperty({ description: 'Order in which the task appears', type: Number })
  @Prop()
  order: number;

  @ApiProperty({ description: 'Project ID the task belongs to', type: String })
  @Prop()
  projectId: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);

TaskSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // copy _id to id
    delete ret._id;              // remove _id
  },
});
