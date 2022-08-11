import { PrismaModule } from './../prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService],
  imports: [PrismaModule],
})
export class TasksModule {}
