import { Controller, Get, Post, Body, Param, Delete, Put, Patch, Query } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Item } from './item.schema';

@ApiTags('items')
@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @ApiOperation({ summary: 'Get all items' })
  @ApiResponse({ status: 200, description: 'List of items', type: [Item] })
  @ApiQuery({ name: 'projectId', required: false, description: 'Filter items by project ID' })
  @ApiQuery({ name: 'sprintId', required: false, description: 'Filter items by sprint ID' })
  @Get()
  findAll(
    @Query('projectId') projectId?: string,
    @Query('sprintId') sprintId?: string,
  ) {
    if (projectId && sprintId) {
      return this.itemService.findByProjectAndSprint(projectId, sprintId);
    } else if (projectId) {
      return this.itemService.findByProject(projectId);
    } else if (sprintId) {
      return this.itemService.findBySprint(sprintId);
    }
    return this.itemService.findAll();
  }

  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item details', type: Item })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created', type: Item })
  @Post()
  create(@Body() createItemDto: Item) {
    return this.itemService.create(createItemDto);
  }

  @ApiOperation({ summary: 'Update item by ID' })
  @ApiResponse({ status: 200, description: 'Updated item', type: Item })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateItemDto: Item) {
    return this.itemService.update(id, updateItemDto);
  }

  @ApiOperation({ summary: 'Partially update item by ID' })
  @ApiResponse({ status: 200, description: 'Partially updated item', type: Item })
  @Patch(':id')
  patch(@Param('id') id: string, @Body() patchItemDto: Partial<Item>) {
    return this.itemService.update(id, patchItemDto);
  }

  @ApiOperation({ summary: 'Delete item by ID' })
  @ApiResponse({ status: 200, description: 'Item deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(id);
  }

  @ApiOperation({ summary: 'Assign item to sprint' })
  @ApiResponse({ status: 200, description: 'Item assigned to sprint', type: Item })
  @Patch(':id/assign-sprint/:sprintId')
  assignToSprint(@Param('id') id: string, @Param('sprintId') sprintId: string) {
    return this.itemService.assignToSprint(id, sprintId);
  }

  @ApiOperation({ summary: 'Assign item to user' })
  @ApiResponse({ status: 200, description: 'Item assigned to user', type: Item })
  @Patch(':id/assign-user/:userId')
  assignToUser(@Param('id') id: string, @Param('userId') userId: string) {
    return this.itemService.assignToUser(id, userId);
  }
  
  @ApiOperation({ summary: 'Update item status' })
  @ApiResponse({ status: 200, description: 'Item status updated', type: Item })
  @Patch(':id/status/:status')
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.itemService.updateStatus(id, status);
  }
}