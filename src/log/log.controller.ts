import {
  Body,
  Controller,
  Post,
  Headers,
  HttpException,
  HttpStatus,
  Put,
  Get,
} from '@nestjs/common';
import { LogService } from './log.service';
import { Prisma } from '@prisma/client';
import { AuthService } from '../auth/auth.service';

@Controller('log')
export class LogController {
  constructor(
    private logService: LogService,
    private authService: AuthService,
  ) {}

  @Get()
  async getRunningLog(
    @Headers()
    headers: {
      group_id: number;
      project_id: number;
      authorization: string;
    },
  ) {
    const jwtClaims = this.authService.verifyToken(headers.authorization);
    const user_id = jwtClaims.sub;
    const group_id = Number(headers.group_id);
    const project_id = Number(headers.project_id);
    return await this.logService.getRunningLog(user_id, group_id, project_id);
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
  async close(@Body() body: { log_id: number }) {
    // TODO: implement to check if the task exists
    const res = await this.logService.getStatus(body.log_id);
    if (res === null) {
      throw new HttpException('Log not found', HttpStatus.NOT_FOUND);
    }
    if (res.hasOwnProperty('status') && res.status === 0) {
      throw new HttpException('Log is already closed', HttpStatus.BAD_REQUEST);
    } else {
      return await this.logService.close(body.log_id);
    }
  }
}
