import {
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DatabaseError, PoolClient } from 'pg';
import { Project } from './entities/project.entity';
import { DatabaseHttpException } from '../common/error-handlers/database-http-exception';

@Injectable()
export class ProjectService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(createProjectDto: CreateProjectDto, user_id: number) {
    console.log(createProjectDto);
    try {
      const today = new Date();
      const projectRes = await this.dbClient.query<Project>(
        `INSERT INTO projects (name, description, created_at, status, user_id)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        [
          createProjectDto.name,
          createProjectDto.description,
          today,
          createProjectDto.status,
          user_id,
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

  async findAll(user_id: number) {
    try {
      const projectsRes = await this.dbClient.query<Project>(
        `SELECT *
         FROM projects
         WHERE user_id = $1
           AND status != 4`,
        [user_id],
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

  async findOne(id: number, user_id: number) {
    try {
      const projectsRes = await this.dbClient.query<Project>(
        `SELECT *
         FROM projects
         WHERE id = $1
           AND user_id = $2`,
        [id, user_id],
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

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    user_id: number,
  ) {
    try {
      if (updateProjectDto.status === 4) {
        throw new ConflictException('Invalid project status');
      }
      const projectsRes = await this.dbClient.query<Project>(
        `UPDATE projects
         SET name        = $1,
             description = $2,
             status      = $3
         WHERE id = $4
           and user_id = $5
         RETURNING *`,
        [
          updateProjectDto.name,
          updateProjectDto.description,
          updateProjectDto.status,
          id,
          user_id,
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

  async remove(id: number, user_id: number) {
    try {
      const status = 4;
      const projectsRes = await this.dbClient.query<Project>(
        `UPDATE projects
         SET status = $1
         WHERE id = $2
           and user_id = $3
         RETURNING *`,
        [status, id, user_id],
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
