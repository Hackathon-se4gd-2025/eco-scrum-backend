import { Module } from '@nestjs/common';
import { ProjectService } from './projects.service';
import { ProjectController } from './projects.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './projects.schema';
import { Sprint, SprintSchema } from '../sprint/sprint.schema';


@Module({
  imports: [MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }, { name: Sprint.name, schema: SprintSchema }])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}

