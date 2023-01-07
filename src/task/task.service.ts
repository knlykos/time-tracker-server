import { Injectable, OnModuleInit } from '@nestjs/common';
import { Prisma, ntt_tasks } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from 'src/user/user.controller';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  create(nttTasks: Prisma.ntt_tasksCreateInput): Promise<ntt_tasks> {
    return this.prisma.ntt_tasks.create({ data: nttTasks });
  }

  async closeTask(task_id: number) {
    return this.prisma.ntt_tasks.update({
      where: { id: task_id },
      data: { status: 0 },
    });
  }
}
