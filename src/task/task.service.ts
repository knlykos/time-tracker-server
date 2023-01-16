import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, tasks } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from 'src/user/user.controller';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(task: Prisma.tasksCreateInput): Promise<tasks> {
    return this.prisma.tasks.create({ data: task });
  }

  async closeTask(task_id: number) {
    return this.prisma.tasks.update({
      where: { task_id },
      data: { task_status: 'pending' },
    });
  }
}
