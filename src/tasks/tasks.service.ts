import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskModel } from './task.model';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  getAllTasks(): Promise<TaskModel[]> {
    return this.prisma.task.findMany();
  }

  // getTasksWithFilters({ search, status }: GetTasksFilterDto): Task[] {
  //   let tasks = this.getAllTasks();

  //   if (status) {
  //     tasks = tasks.filter((task) => task.status === status);
  //   }

  //   if (search) {
  //     tasks = tasks.filter(
  //       (task) =>
  //         task.title.includes(search) || task.description.includes(search),
  //     );
  //   }

  //   return tasks;
  // }

  // getTaskById(id: string): Task {
  //   const found = this.tasks.find((task) => task.id === id);
  //   if (!found) throw new NotFoundException(`Task with ID "${id}" not found`);
  //   return found;
  // }

  // createTask({ title, description }: CreateTaskDto): Task {
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }

  // deleteTask(id: string): void {
  //   const found = this.getTaskById(id);
  //   this.tasks = this.tasks.filter((task) => task.id !== found.id);
  // }

  // updateTaskStatus(id: string, { status }: UpdateTaskStatusDto): Task {
  //   const task = this.getTaskById(id);
  //   task.status = status;
  //   return task;
  // }
}
