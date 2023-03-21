import {
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
} from '@nestjs/common';
import { UserController } from 'src/user/user.controller';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { NkodexDbService } from '@nkodex-db/nkodex-db';
import { DatabaseError, PoolClient } from 'pg';
import { DatabasePgError } from '../common/error-handlers/database-pg-error';
import { DatabaseHttpException } from '../common/error-handlers/database-http-exception';

@Injectable()
export class TaskService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(task: CreateTaskDto) {
    try {
      const today = new Date();
      const taskRes = await this.dbClient.query(
        `INSERT INTO tasks (task_name, task_description, priority,
                            due_date, created_at, assignee)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          task.task_name,
          task.task_description,
          task.priority,
          task.due_date,
          today,
          task.assignee,
        ],
      );
      if (taskRes.rows.length > 0) {
        return taskRes.rows[0];
      } else {
        throw new ConflictException();
      }
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === '23503') {
          throw new DatabaseHttpException('Database error', e.code, e.detail);
        }
      }
      console.log(e);
      throw new InternalServerErrorException();
    }
  }
}
