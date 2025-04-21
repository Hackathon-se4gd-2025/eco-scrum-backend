import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { SusafController } from './susaf.controller';
import { SusafService } from './susaf.service';
import { 
  SustainabilityEffect, SustainabilityEffectSchema,
  EffectDetail, EffectDetailSchema,
  Recommendation, RecommendationSchema,
  ProjectApiToken, ProjectApiTokenSchema
} from './susaf.schema';
import { BacklogItem, BacklogItemSchema } from 'src/backlog-item/backlog-item.schema';
import { Project, ProjectSchema } from 'src/projects/projects.schema';
import { ItemModule } from '../item/item.module';
import { Item, ItemSchema } from 'src/item/item.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: SustainabilityEffect.name, schema: SustainabilityEffectSchema },
      { name: EffectDetail.name, schema: EffectDetailSchema },
      { name: Recommendation.name, schema: RecommendationSchema },
      { name: Item.name, schema: ItemSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ProjectApiToken.name, schema: ProjectApiTokenSchema }
    ])    ,
  ],
  controllers: [SusafController],
  providers: [SusafService],
  exports: [SusafService],
})
export class SusafModule {}