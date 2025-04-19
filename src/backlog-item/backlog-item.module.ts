// src/backlog-item/backlog-item.module.ts
import { Module } from '@nestjs/common';
import { BacklogItemService } from './backlog-item.service';
import { BacklogItemController } from './backlog-item.controller';
import { BacklogItem, BacklogItemSchema } from './backlog-item.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forFeature([{ name: BacklogItem.name, schema: BacklogItemSchema }])],
  controllers: [BacklogItemController],
  providers: [BacklogItemService],
})
export class BacklogItemModule { }
