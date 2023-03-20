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

@Injectable()
export class TaskService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(task: CreateTaskDto) {
    try {
      const taskRes = await this.dbClient
        .query(`INSERT INTO tasks (task_name, task_description, priority,
                                   due_date, created_at, assignee)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`);
      if (taskRes.rows.length > 0) {
        return taskRes.rows[0];
      } else {
        throw new ConflictException();
      }
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
