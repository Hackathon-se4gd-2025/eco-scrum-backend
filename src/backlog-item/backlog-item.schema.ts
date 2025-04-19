// backlog-item/schemas/backlog-item.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type BacklogItemDocument = BacklogItem & Document;

@Schema()
export class BacklogItem {
  @ApiProperty({ description: 'Title of the backlog item', type: String })
  @Prop()
  title: string;

  @ApiProperty({ description: 'Description of the backlog item', type: String })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Priority level of the backlog item', type: String })
  @Prop()
  priority: string;

  @ApiProperty({ description: 'Is the backlog item sustainable?', type: Boolean })
  @Prop()
  sustainable: boolean;

  @ApiProperty({ description: 'Story points of the backlog item', type: Number })
  @Prop()
  storyPoints: number;

  @ApiProperty({ description: 'Sustainability score of the backlog item', type: Number })
  @Prop()
  sustainabilityScore: number;

  @ApiProperty({ description: 'Status of the backlog item', type: String })
  @Prop()
  status: string;

  @ApiProperty({ description: 'SusAF category of the backlog item', type: String, required: false })
  @Prop()
  susafCategory?: string;

  @ApiProperty({ description: 'User assigned to the backlog item', type: String, required: false })
  @Prop()
  assignedTo?: string;

  @ApiProperty({ description: 'Sprint ID for the backlog item', type: String, required: false })
  @Prop()
  sprintId?: string;

  @ApiProperty({ description: 'Project ID for the backlog item', type: String })
  @Prop()
  projectId: string;

  @ApiProperty({ description: 'Sustainability points of the backlog item', type: Number, required: false })
  @Prop()
  sustainabilityPoints?: number;

  @ApiProperty({ description: 'Related SusAF effects', type: [String], required: false })
  @Prop({ type: [String] })
  relatedSusafEffects?: string[];

  @ApiProperty({ description: 'Definition of Done for the backlog item', type: String, required: false })
  @Prop()
  definitionOfDone?: string;

  @ApiProperty({ description: 'Tags for the backlog item', type: [String], required: false })
  @Prop({ type: [String] })
  tags?: string[];
}

export const BacklogItemSchema = SchemaFactory.createForClass(BacklogItem);
BacklogItemSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id.toString(); // copy _id to id
    delete ret._id;              // remove _id
  },
});
