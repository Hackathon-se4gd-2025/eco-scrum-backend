// project/schemas/project.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { TeamMember } from '../team-member/team-member.schema';
import { ApiProperty } from '@nestjs/swagger';

export type ProjectDocument = Project & Document;

@Schema()
export class Project {
   @ApiProperty({ description: 'Auto-generated ObjectId', type: String })
   @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true }) // Auto-generated ObjectId
  id: string;

  @ApiProperty({ description: 'Name of the project', type: String })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ description: 'Description of the project', type: String })
  @Prop()
  description: string;

  @ApiProperty({ description: 'Creation date of the project', type: String })
  @Prop()
  createdAt: string;

  @ApiProperty({ description: 'User who created the project', type: String })
  @Prop()
  createdBy: string;

  @ApiProperty({ description: 'List of team members involved in the project', type: [TeamMember] })
  @Prop({ type: [{ type: Object }] }) // Can be refined
  teamMembers: TeamMember[];

  @ApiProperty({ description: 'List of sprint IDs associated with the project', type: [String] })
  @Prop({ type: [String] })
  sprints: string[];
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
