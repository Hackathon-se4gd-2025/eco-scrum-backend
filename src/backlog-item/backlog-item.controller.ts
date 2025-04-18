// src/backlog-item/backlog-item.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { BacklogItemService } from './backlog-item.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BacklogItem } from './backlog-item.schema';

@ApiTags('backlogItems')
@Controller('backlog-items')
export class BacklogItemController {
  constructor(private readonly backlogItemService: BacklogItemService) {}

  @ApiOperation({ summary: 'Get all backlog items' })
  @ApiResponse({ status: 200, description: 'List of backlog items', type: [BacklogItem] })
  @Get()
  findAll() {
    return this.backlogItemService.findAll();
  }

  @ApiOperation({ summary: 'Get backlog item by ID' })
  @ApiResponse({ status: 200, description: 'Backlog item details', type: BacklogItem })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.backlogItemService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new backlog item' })
  @ApiResponse({ status: 201, description: 'Backlog item created', type: BacklogItem })
  @Post()
  create(@Body() createBacklogItemDto: BacklogItem) {
    return this.backlogItemService.create(createBacklogItemDto);
  }

  @ApiOperation({ summary: 'Update backlog item by ID' })
  @ApiResponse({ status: 200, description: 'Updated backlog item', type: BacklogItem })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateBacklogItemDto: BacklogItem) {
    return this.backlogItemService.update(id, updateBacklogItemDto);
  }

  @ApiOperation({ summary: 'Delete backlog item by ID' })
  @ApiResponse({ status: 200, description: 'Backlog item deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.backlogItemService.remove(id);
  }
}
