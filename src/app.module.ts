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
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SusafModule } from './susaf/susaf.module';
import { ItemModule } from './item/item.module';


@Module({
  imports:[
  ConfigModule.forRoot({ isGlobal: true }),
  UserModule,
  ProjectModule,
  TaskModule,
  SprintModule,
  TeamMemberModule,
  BacklogItemModule,
  SusafModule,
  ItemModule,
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
    }),
    inject: [ConfigService],
  }),  ]
})
export class AppModule {}
