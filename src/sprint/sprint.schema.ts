// sprint/schemas/sprint.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type SprintDocument = Sprint & Document;

@Schema()
export class Sprint {
  @ApiProperty({ description: 'Name of the sprint', type: String })
  @Prop()
  name: string;

  @ApiProperty({ description: 'Goal of the sprint', type: String })
  @Prop()
  goal: string;

  @ApiProperty({ description: 'Start date of the sprint', type: String })
  @Prop()
  startDate: string;

  @ApiProperty({ description: 'End date of the sprint', type: String })
  @Prop()
  endDate: string;

  @ApiProperty({ description: 'Progress of the sprint in percentage', type: Number })
  @Prop()
  progress: number;

  @ApiProperty({ description: 'Sustainability score of the sprint', type: Number })
  @Prop()
  sustainabilityScore: number;

  @ApiProperty({ description: 'Previous sustainability score of the sprint', type: Number })
  @Prop()
  previousScore: number;

  @ApiProperty({ description: 'Number of effects tackled in the sprint', type: Number })
  @Prop()
  effectsTackled: number;

  @ApiProperty({ description: 'List of task IDs associated with the sprint', type: [String] })
  @Prop({ type: [String] })
  tasks: string[];

  @ApiProperty({ description: 'Project ID to which the sprint belongs', type: String })
  @Prop()
  projectId: string;

  @Prop({ default: false })
  @ApiProperty({ description: 'Sprint completed', type: Boolean, default: 'false' })
  completed: boolean;

  @ApiProperty({
    description: 'Retrospective information for the sprint',
    type: Object,
    required: false,
  })
  @Prop({
    type: {
      goalMet: { type: String },
      inefficientProcesses: String,
      improvements: String,
      teamNotes: String,
    },
    required: false,
  })
  retrospective?: {
    goalMet: 'Yes' | 'No' | 'Partially';
    inefficientProcesses: string;
    improvements: string;
    teamNotes: string;
  };
}

export const SprintSchema = SchemaFactory.createForClass(Sprint);
SprintSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // copy _id to id
    delete ret._id;              // remove _id
  },
});