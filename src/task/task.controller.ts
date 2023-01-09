import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Prisma } from '@prisma/client';
import { TaskService } from './task.service';
import { LogService } from 'src/log/log.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('task')
export class TaskController {
  constructor(
    private authService: AuthService,
    private taskService: TaskService,
    private logService: LogService,
  ) {}

  @Post()
  // TODO: add a constraint if is there some open log for the user and task id in the same group id and project id, should throw a error
  // that a task is already open
  async createTask(
    @Body() body: Prisma.ntt_tasksCreateInput,
    @Headers() headers: any,
  ) {
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const openLogsCount = await this.logService.checkForOpenLog(jwtClaims.sub);
    if (openLogsCount > 0) {
      throw new HttpException('A task is already open', HttpStatus.BAD_REQUEST);
    }
    const todayDate = new Date();

    const task = await this.taskService.create(body);
    const logCreateInput: Prisma.ntt_logCreateInput = {
      date: todayDate,
      start: todayDate,
      project_id: body.project_id,
      task_id: task.id,
      user_id: jwtClaims.sub,
      group_id: task.group_id,
      status: 1,
    };

    const log = await this.logService.create(
      logCreateInput.task_id,
      logCreateInput.user_id,
      logCreateInput.group_id,
      logCreateInput.project_id,
    );
  }

  @Put('close')
  async closeTask(
    @Body() body: { task_id: number; log_id: number },
    @Headers() headers: any,
  ) {
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const todayDate = new Date();
    try {
      await this.taskService.closeTask(body.task_id);
      return await this.logService.close(body.log_id, jwtClaims.sub);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
    }
  }
}
