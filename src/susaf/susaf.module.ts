import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { EffectDetail, EffectDetailSchema, Recommendation, RecommendationSchema, SustainabilityEffect, SustainabilityEffectSchema } from './susaf.schema';
import { Project, ProjectSchema } from 'src/projects/projects.schema';
import { SusafController } from './susaf.controller';
import { SusafService } from './susaf.service';
import { BacklogItem } from 'src/backlog-item/backlog-item.schema';


@Module({
  imports: [
    HttpModule, // ✅ Allows HTTP requests to external APIs
    MongooseModule.forFeature([
      { name: SustainabilityEffect.name, schema: SustainabilityEffectSchema },
      { name: EffectDetail.name, schema: EffectDetailSchema },
      { name: Recommendation.name, schema: RecommendationSchema },
      { name: BacklogItem.name, schema: BacklogItem },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [SusafController],
  providers: [SusafService],
})
export class SusafModule {}