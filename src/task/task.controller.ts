import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Task } from './task.schema';

@ApiTags('tasks')
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'List of tasks', type: [Task] })
  @Get()
  findAll() {
    return this.taskService.findAll();
  }

  @ApiOperation({ summary: 'Get task by ID' })
  @ApiResponse({ status: 200, description: 'Task details', type: Task })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @ApiOperation({ summary: 'Create a new task' })
  @ApiResponse({ status: 201, description: 'Task created', type: Task })
  @Post()
  create(@Body() createTaskDto: Task) {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({ summary: 'Update task by ID' })
  @ApiResponse({ status: 200, description: 'Updated task', type: Task })
  @Put(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: Task) {
    return this.taskService.update(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete task by ID' })
  @ApiResponse({ status: 200, description: 'Task deleted', type: Object })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiResponse({ status: 200, description: 'Task updated', type: Task })
  updateTask(@Param('id') id: string, @Body() updateData: Partial<Task>) {
    return this.taskService.update(id, updateData);
  }
}
