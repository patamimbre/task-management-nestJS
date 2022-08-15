import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { TaskModel } from './task.model';
import { GetUserId } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @GetUserId() userId: string,
  ): Promise<TaskModel[]> {
    if (Object.keys(filterDto).length) {
      return this.tasksService.getTasksWithFilters(filterDto, userId);
    }
    return this.tasksService.getAllTasks(userId);
  }

  @Get('/:id')
  getTaskById(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<TaskModel> {
    return this.tasksService.getTaskById(id, userId);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUserId() userId: string,
  ): Promise<TaskModel> {
    return this.tasksService.createTask(createTaskDto, userId);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') id: string,
    @GetUserId() userId: string,
  ): Promise<TaskModel> {
    return this.tasksService.deleteTask(id, userId);
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @GetUserId() userId: string,
  ): Promise<TaskModel> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto, userId);
  }
}
