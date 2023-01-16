import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, logs } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getRunningLog(user_id: number, group_id: number, project_id: number) {
    const currentLog = await this.prisma.logs.findFirst({
      where: {
        status: 'running',
        end_time: null,
        user_id,
        group_id,
        project_id,
      },
    });
    if (currentLog) {
      return currentLog;
    }
  }

  calculateDuration(start_time: Date, now: DateTime) {
    const startDateTime = DateTime.fromJSDate(start_time);
    const duration = now.diff(startDateTime, ['hours', 'minutes', 'seconds']);
    return duration;
  }

  async create(
    task_id: number,
    user_id: number,
    group_id: number,
    project_id: number,
  ) {
    const date = new Date();
    const args: Prisma.logsUncheckedCreateInput = {
      task_id: task_id,
      start_time: date,
      date: date,
      user_id: user_id,
      group_id: group_id,
      project_id: project_id,
      status: 'running',
    };
    return this.prisma.logs.create({ data: args });
  }

  async checkForOpenLog(user_id: number) {
    console.log(`SELECT COUNT(*)::int
    FROM logs
    WHERE user_id = ${user_id}
      AND STATUS = 'running'
      AND "end_time" IS NULL;`);
    const res = await this.prisma.$queryRaw`SELECT COUNT(*)::int
                                            FROM logs
                                            WHERE user_id = ${user_id}
                                              AND STATUS = 'running'
                                              AND "end_time" IS NULL;`;
    return res[0].count;
  }

  async close(log_id: number, user_id: number) {
    this.prisma.logs.findFirst();
    await this.getRunningLog(user_id, 1, 1);
    return this.prisma.logs.update({
      where: { log_id: log_id },
      data: { end_time: new Date(), status: 'running' },
    });
  }

  async getStatus(log_id: number) {
    return this.prisma.logs.findUnique({
      where: { log_id: log_id },
      select: { status: true },
    });
  }
}
