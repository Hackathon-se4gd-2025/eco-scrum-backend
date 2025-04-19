import { Module } from '@nestjs/common';
import { SprintService } from './sprint.service';
import { SprintController } from './sprint.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Sprint, SprintSchema } from './sprint.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sprint.name, schema: SprintSchema }])],
  controllers: [SprintController],
  providers: [SprintService],
})
export class SprintModule { }

