import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLogDto } from './dto/create-log.dto';
import { UpdateLogDto } from './dto/update-log.dto';
import { Project } from '../project/entities/project.entity';
import { DatabaseError, PoolClient } from 'pg';
import { DatabaseHttpException } from '../common/error-handlers/database-http-exception';
import { Log } from './entities/log.entity';

@Injectable()
export class LogService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(createLogDto: CreateLogDto, userId: number) {
    try {
      const today = new Date();
      createLogDto.date = today;
      createLogDto.startTime = today;
      const projectRes = await this.dbClient.query<Project>(
        `INSERT INTO logs(user_id, group_id, org_id, date, start_time, end_time, duration, client_id, project_id,
                          task_id, timesheet_id, invoice_id, notes, billable, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
         RETURNING log_id;`,
        [
          userId,
          createLogDto.groupId,
          createLogDto.orgId,
          createLogDto.date,
          createLogDto.startTime,
          createLogDto.endTime,
          createLogDto.duration,
          createLogDto.clientId,
          createLogDto.projectId,
          createLogDto.taskId,
          createLogDto.timesheetId,
          createLogDto.invoiceId,
          createLogDto.notes,
          createLogDto.billable,
          createLogDto.status,
        ],
      );
      console.log(projectRes && projectRes.rows && projectRes.rows.length > 0);
      if (projectRes && projectRes.rows && projectRes.rows.length > 0) {
        return projectRes.rows[0];
      } else {
        throw new ConflictException();
      }
    } catch (e) {
      console.log(e);
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async stopRunningLog(
    logId: number,
    userId: number,
    endTime: Date,
  ): Promise<void> {
    try {
      const { rows: runningLogs } = await this.dbClient.query<Log>(
        `SELECT *
         FROM logs
         WHERE log_id = $1
           AND user_id = $2
           AND status = 2`,
        [logId, userId],
      );
      if (runningLogs && runningLogs.length > 0) {
        const runningLog = runningLogs[0];
        const start = new Date(runningLog.start_time);
        const duration = (endTime.getTime() - start.getTime()) / 1000; // calculate duration in seconds
        const { rows } = await this.dbClient.query<Log>(
          `UPDATE logs
           SET end_time = $1,
               duration = $2,
               status   = 'completed'
           WHERE log_id = $3
           RETURNING *;`,
          [endTime, `${duration} seconds`, logId],
        );
        if (rows && rows.length > 0) {
          const updatedLog = rows[0];
          return;
        }
      }
      throw new NotFoundException();
    } catch (e) {
      console.log(e);
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: number) {
    try {
      const projectsRes = await this.dbClient.query<Project>(
        `SELECT *
         FROM logs
         WHERE user_id =
               $1
           AND status
             !=
               4`,
        [userId],
      );
      if (projectsRes && projectsRes.rows && projectsRes.rows.length > 0) {
        return projectsRes.rows;
      } else if (
        projectsRes &&
        projectsRes.rows &&
        projectsRes.rows.length === 0
      ) {
        throw new NotFoundException();
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const projectsRes = await this.dbClient.query<Project>(
        `SELECT *
         FROM logs
         WHERE log_id = $1
           AND user_id = $2`,
        [id, userId],
      );
      if (projectsRes && projectsRes.rows && projectsRes.rows.length > 0) {
        return projectsRes.rows[0];
      } else if (
        projectsRes &&
        projectsRes.rows &&
        projectsRes.rows.length === 0
      ) {
        throw new NotFoundException();
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, updateLogDto: UpdateLogDto, userId: number) {
    try {
      if (updateLogDto.status === 4) {
        throw new ConflictException('Invalid project status');
      }
      const projectsRes = await this.dbClient.query<Project>(
        `UPDATE logs
         SET user_id      = $1,
             group_id     = $2,
             org_id       = $3,
             date         = $4,
             start_time   = $5,
             end_time     = $6,
             duration     = $7,
             client_id    = $8,
             project_id   = $9,
             task_id      = $10,
             timesheet_id = $11,
             invoice_id   = $12,
             notes        = $13,
             billable     = $14,
             status       = $15
         WHERE log_id = $16
         RETURNING *`,
        [
          userId,
          updateLogDto.groupId,
          updateLogDto.orgId,
          updateLogDto.date,
          updateLogDto.startTime,
          updateLogDto.endTime,
          updateLogDto.duration,
          updateLogDto.clientId,
          updateLogDto.projectId,
          updateLogDto.taskId,
          updateLogDto.timesheetId,
          updateLogDto.invoiceId,
          updateLogDto.notes,
          updateLogDto.billable,
          updateLogDto.status,
          id,
        ],
      );
      if (projectsRes && projectsRes.rows && projectsRes.rows.length > 0) {
        return projectsRes.rows[0];
      } else if (
        projectsRes &&
        projectsRes.rows &&
        projectsRes.rows.length === 0
      ) {
        throw new NotFoundException();
      }
    } catch (e) {
      console.log(e);
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, userId: number) {
    try {
      const status = 4;
      const projectsRes = await this.dbClient.query<Project>(
        `UPDATE logs
         SET status = $1
         WHERE log_id = $2
           and user_id = $3
         RETURNING *`,
        [status, id, userId],
      );
      if (projectsRes && projectsRes.rows && projectsRes.rows.length > 0) {
        return projectsRes.rows[0];
      } else if (
        projectsRes &&
        projectsRes.rows &&
        projectsRes.rows.length === 0
      ) {
        throw new NotFoundException();
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      } else if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException();
    }
  }
}
