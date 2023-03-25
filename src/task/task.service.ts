import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { UserController } from 'src/user/user.controller';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { NkodexDbService } from '@nkodex-db/nkodex-db';
import { DatabaseError, PoolClient } from 'pg';
import { DatabasePgError } from '../common/error-handlers/database-pg-error';
import { DatabaseHttpException } from '../common/error-handlers/database-http-exception';
import { UpdateTaskDto } from './dto/update-task.dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async findById(task_id: number, user_id: number) {
    try {
      const taskRes = await this.dbClient.query(
        `SELECT *
         FROM tasks
         WHERE task_id = $1
           AND user_id = $2`,
        [task_id, user_id],
      );
      if (
        taskRes &&
        taskRes.rows &&
        taskRes.rows.length &&
        taskRes.rows.length > 0
      ) {
        return taskRes.rows[0];
      } else {
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

  async findAll(user_id: number) {
    try {
      const taskRes = await this.dbClient.query(
        `SELECT *
         FROM tasks
         WHERE user_id = $1`,
        [user_id],
      );
      if (
        taskRes &&
        taskRes.rows &&
        taskRes.rows.length &&
        taskRes.rows.length > 0
      ) {
        return taskRes.rows;
      } else {
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

  async create(task: CreateTaskDto, user_id: number) {
    try {
      const today = new Date();
      const taskRes = await this.dbClient.query(
        `INSERT INTO tasks (task_name, task_description, priority,
                            due_date, created_at, assignee, user_id, project_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          task.task_name,
          task.task_description,
          task.priority,
          task.due_date,
          today,
          task.assignee,
          user_id,
          task.project_id,
        ],
      );
      if (
        taskRes &&
        taskRes.rows &&
        taskRes.rows.length &&
        taskRes.rows.length > 0
      ) {
        return taskRes.rows[0];
      } else {
        throw new ConflictException();
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      }
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async update(task: UpdateTaskDto) {
    try {
      const today = new Date();
      const taskRes = await this.dbClient.query(
        `UPDATE tasks
         SET task_name        = $1,
             task_description = $2,
             priority         = $3,
             due_date         = $4,
             assignee         = $5,
             project_id       = $6
         WHERE task_id = $7
         RETURNING *`,
        [
          task.task_name,
          task.task_description,
          task.priority,
          task.due_date,
          task.assignee,
          task.project_id,
          task.task_id,
        ],
      );
      if (
        taskRes &&
        taskRes.rows &&
        taskRes.rows.length &&
        taskRes.rows.length > 0
      ) {
        return taskRes.rows[0];
      } else {
        throw new ConflictException();
      }
    } catch (e) {
      console.log(e.constructor.name);
      if (e instanceof DatabaseError) {
        throw new DatabaseHttpException('Database error', e.code, e.detail);
      }
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
