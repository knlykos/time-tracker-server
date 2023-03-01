import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { TaskService } from './task.service';
import { LogService } from 'src/log/log.service';

@Controller('task')
export class TaskController {
  // constructor(
  //   private authService: AuthService,
  //   private taskService: TaskService,
  //   private logService: LogService,
  // ) {}
  // @Post()
  // // TODO: add a constraint if is there some open log for the user and task id in the same group id and project id, should throw a error
  // // that a task is already open
  // async createTask(@Body() body: tasks, @Headers() headers: any) {
  //   const jwtClaims = this.authService.verifyToken(headers.authorization);
  //   const openLogsCount = await this.logService.checkForOpenLog(jwtClaims.sub);
  //   if (openLogsCount > 0) {
  //     throw new HttpException('A task is already open', HttpStatus.BAD_REQUEST);
  //   }
  //   const todayDate = new Date();
  //
  //   const task = await this.taskService.create(body);
  //   const data = {
  //     task_id: task.task_id,
  //     user_id: jwtClaims.sub,
  //     group_id: task.group_id,
  //     project_id: task.project_id,
  //     start_time: todayDate,
  //     date: todayDate,
  //   };
  //   const logCreateInput: Prisma.logsCreateArgs = {
  //     data,
  //   };
  //   // {
  //   //   date: todayDate,
  //   //   start_time: todayDate,
  //   //   project_id: 1,
  //   //   task_id: task.task_id,
  //   //   user_id: jwtClaims.sub,
  //   //   group_id: task.group_id,
  //   // };
  //
  //   const log = await this.logService.create(
  //     data.task_id,
  //     data.user_id,
  //     data.user_id,
  //     data.group_id,
  //   );
  // }
}
