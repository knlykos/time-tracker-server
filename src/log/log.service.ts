import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { DateTime } from 'luxon';

@Injectable()
export class LogService {
  constructor(private prisma: PrismaService) {}

  async getRunningLog(user_id: number, group_id: number, project_id: number) {
    const currentLog = await this.prisma.ntt_log.findFirst({
      where: {
        status: 1,
        end: null,
        user_id,
        group_id,
        project_id,
      },
    });
    if (currentLog) {
      return currentLog;
    }
  }

  calculateDuration(start: Date, now: DateTime) {
    const startDateTime = DateTime.fromJSDate(start);
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
    const args: Prisma.ntt_logCreateInput = {
      task_id: task_id,
      start: date,
      date: date,
      user_id: user_id,
      group_id: group_id,
      project_id: project_id,
      status: 1,
    };
    return this.prisma.ntt_log.create({ data: args });
  }

  async checkForOpenLog(user_id: number) {
    const res = await this.prisma.$queryRaw`SELECT COUNT(*)::int
                                            FROM ntt_log
                                            WHERE user_id = ${user_id}
                                              AND STATUS = 1
                                              AND "end" IS NULL;`;
    return res[0].count;
  }

  async close(log_id: number, user_id: number) {
    this.prisma.ntt_log.findFirst();
    await this.getRunningLog(user_id, 1, 1);
    return this.prisma.ntt_log.update({
      where: { id: log_id },
      data: { end: new Date(), status: 0 },
    });
  }

  async getStatus(log_id: number) {
    return this.prisma.ntt_log.findUnique({
      where: { id: log_id },
      select: { status: true },
    });
  }
}
