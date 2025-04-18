import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/users.module';
import { ProjectModule } from './projects/projects.module';
import { TaskModule } from './task/task.module';
import { SprintModule } from './sprint/sprint.module';
import { TeamMemberModule } from './team-member/team-member.module';
import { BacklogItemModule } from './backlog-item/backlog-item.module';


@Module({
  imports:[
  UserModule,
  ProjectModule,
  TaskModule,
  SprintModule,
  TeamMemberModule,
  BacklogItemModule,
  MongooseModule.forRoot('mongodb+srv://admin:hyYFr82agsUAkXQx@susafscrum.xvvfz.mongodb.net/?retryWrites=true&w=majority&appName=SuSAFScrum')
  ]
})
export class AppModule {}
