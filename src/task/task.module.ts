import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { LogService } from '../log/log.service';

@Module({
  imports: [AuthModule],
  controllers: [TaskController],
  providers: [TaskService, PrismaService, LogService],
  exports: [PrismaService, LogService],
})
export class TaskModule {}
