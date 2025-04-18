// team-member/schemas/team-member.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type TeamMemberDocument = TeamMember & Document;

@Schema()
export class TeamMember {
  @ApiProperty({ description: 'Auto-generated ObjectId for the user', type: String })
  @Prop({ type: mongoose.Schema.Types.ObjectId, auto: true }) // Auto-generated ObjectId
  userId: string;

  @ApiProperty({ description: 'Role of the team member', type: String })
  @Prop({ required: true })
  role: string;

  @ApiProperty({ description: 'Email of the team member', type: String })
  @Prop({ required: true })
  email: string;

  @ApiProperty({ description: 'Date when the team member joined', type: String })
  @Prop({ required: true })
  joinedAt: string;
}

export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
