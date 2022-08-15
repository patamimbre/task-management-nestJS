import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskModel } from './task.model';
import { Prisma } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAllTasks(userId: string): Promise<TaskModel[]> {
    return this.prisma.task.findMany({
      where: { userId },
    });
  }

  getTasksWithFilters(
    { search, status }: GetTasksFilterDto,
    userId: string,
  ): Promise<TaskModel[]> {
    const where: Prisma.TaskWhereInput = {
      AND: [{ userId }],
    };
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

  async getTaskById(id: string, userId: string): Promise<TaskModel> {
    return this.prisma.task.findUnique({
      where: { id_userId: { id, userId } },
    });
  }

  async createTask(
    createTaskDto: CreateTaskDto,
    userId: string,
  ): Promise<TaskModel> {
    return this.prisma.task.create({ data: { ...createTaskDto, userId } });
  }

  deleteTask(id: string, userId: string): Promise<TaskModel> {
    return this.prisma.task.delete({ where: { id_userId: { id, userId } } });
  }

  updateTaskStatus(
    id: string,
    { status }: UpdateTaskStatusDto,
    userId: string,
  ): Promise<TaskModel> {
    return this.prisma.task.update({
      where: { id_userId: { id, userId } },
      data: { status },
    });
  }
}
