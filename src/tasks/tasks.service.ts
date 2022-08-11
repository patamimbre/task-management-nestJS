import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskModel } from './task.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAllTasks(): Promise<TaskModel[]> {
    return this.prisma.task.findMany();
  }

  getTasksWithFilters({
    search,
    status,
  }: GetTasksFilterDto): Promise<TaskModel[]> {
    const where: Prisma.TaskWhereInput = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        {
          description: { contains: search, mode: Prisma.QueryMode.insensitive },
        },
      ];
    }
    if (status) {
      where.status = status;
    }
    return this.prisma.task.findMany({ where });
  }

  async getTaskById(id: string): Promise<TaskModel> {
    const found = await this.prisma.task.findUnique({ where: { id } });
    if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskModel> {
    return this.prisma.task.create({ data: createTaskDto });
  }

  deleteTask(id: string): Promise<TaskModel> {
    return this.prisma.task.delete({ where: { id } }).catch((err) => {
      if (err.code === 'P2025') {
        // Task not found
        throw new NotFoundException(`Task with ID "${id}" not found`);
      }
      throw err;
    });
  }

  updateTaskStatus(
    id: string,
    { status }: UpdateTaskStatusDto,
  ): Promise<TaskModel> {
    return this.prisma.task
      .update({
        where: { id },
        data: { status },
      })
      .catch((err) => {
        if (err.code === 'P2025') {
          // Task not found
          throw new NotFoundException(`Task with ID "${id}" not found`);
        }
        throw err;
      });
  }
}
