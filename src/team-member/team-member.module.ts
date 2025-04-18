import { Module } from '@nestjs/common';
import { TeamMemberService } from './team-member.service';
import { TeamMemberController } from './team-member.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TeamMember, TeamMemberSchema } from './team-member.schema';
 
@Module({
  imports: [MongooseModule.forFeature([{ name: TeamMember.name, schema: TeamMemberSchema }])],
  controllers: [TeamMemberController],
  providers: [TeamMemberService],
})
export class TeamMemberModule {}