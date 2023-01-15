import {
  Body,
  Controller,
  Post,
  Headers,
  HttpException,
  HttpStatus,
  Put,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { LogService } from './log.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';
import { DateTime } from 'luxon';

@Controller('log')
export class LogController {
  constructor(
    private logService: LogService,
    private authService: AuthService,
  ) {}

  @Get()
  async getRunningLog(
    @Query() params: { group_id: number; project_id: number },
    @Headers()
    headers: {
      authorization: string;
    },
  ) {
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const user_id = jwtClaims.sub;
    const group_id = Number(params.group_id);
    const project_id = Number(params.project_id);
    const currentLog = await this.logService.getRunningLog(
      user_id,
      group_id,
      project_id,
    );
    if (!currentLog) {
      throw new HttpException('No running log found', HttpStatus.NOT_FOUND);
    }
    const now = DateTime.now();

    this.logService.calculateDuration(currentLog.start, now);
    const duration = this.logService.calculateDuration(currentLog.start, now);
    // const durationTime =
    //   duration.hours + ':' + duration.minutes + ':' + duration.seconds;
    const logDetails = {
      log: currentLog,
      serverTime: now.toJSDate(),
      currentDurationTime:
        duration.hours + ':' + duration.minutes + ':' + duration.seconds,
      serverTimeEpoch: now.toMillis(),
    };
    return logDetails;
  }

  @Post()
  async create(
    @Body() body: Prisma.ntt_logCreateInput,
    @Headers() headers: any,
  ) {
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const user_id = jwtClaims.sub;
    const openLogsCount = await this.logService.checkForOpenLog(user_id);
    if (openLogsCount > 0) {
      throw new HttpException('A log is already open', HttpStatus.BAD_REQUEST);
    }
    return await this.logService.create(
      body.task_id,
      user_id,
      body.group_id,
      body.project_id,
    );
  }

  @Put('close')
  async close(@Body() body: { log_id: number }, @Headers() headers: any) {
    // TODO: implement to check if the task exists and if the user is the owner of the task
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const res = await this.logService.getStatus(body.log_id);
    if (res === null) {
      throw new HttpException('Log not found', HttpStatus.NOT_FOUND);
    }
    if (res.hasOwnProperty('status') && res.status === 0) {
      throw new HttpException('Log is already closed', HttpStatus.BAD_REQUEST);
    } else {
      return await this.logService.close(body.log_id, jwtClaims.sub);
    }
  }
}
