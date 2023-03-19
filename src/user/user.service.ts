import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { DatabaseError, PoolClient } from 'pg';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { AuthenticationErrors } from '../auth/constants/auth-error-messages';
import { UserErrorMessages } from './constant/common/user-error-messages';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UserDto } from './dto/user.dto/userDto';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create<T>(
    payload: CreateUserDto,
    promise?: Promise<T>,
  ): Promise<CreateUserDto> {
    // TODO: password is not null and verify comments on table
    try {
      const status = 3;
      const roleId = 2;
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
      await this.dbClient.query('BEGIN');
      const user = await this.dbClient.query<CreateUserDto>(
        `INSERT INTO users (email, password, username, status, group_id, org_id, role_id, client_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING *`,
        [
          payload.email,
          hashedPassword,
          payload.username,
          status,
          payload.group_id,
          payload.org_id,
          roleId,
          payload.client_id,
        ],
      );
      if (promise) {
        await promise;
      }
      await this.dbClient.query('COMMIT');
      return user.rows[0];
    } catch (error) {
      await this.dbClient.query('ROLLBACK');
      if (error instanceof DatabaseError) {
        const message: string = error.message;
        if (error.code === '23505') {
          if (message.includes('email')) {
            throw new ConflictException(UserErrorMessages.EMAIL_ALREADY_IN_USE);
          } else if (message.includes('username')) {
            throw new ConflictException(
              UserErrorMessages.USERNAME_ALREADY_IN_USE,
            );
          }
        }
      }
      throw new BadRequestException();
    }
  }

  async findOneById(id: number) {
    const result = await this.dbClient.query(
      `SELECT *
       FROM users
       WHERE id = $1`,
      [id],
    );
    return result.rows;
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    try {
      const result = await this.dbClient.query<UserDto>(
        `SELECT *
         FROM users
         WHERE email = $1`,
        [email],
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updatePassword(payload: any) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
    await this.dbClient.query(
      `UPDATE users
       SET password = $1
       WHERE id = $2`,
      [hashedPassword, payload.id],
    );
    try {
    } catch (error) {
      throw error;
    }
  }

  async activateUser(email: string) {
    try {
      const userStatus = await this.dbClient.query(
        'SELECT status FROM users WHERE email = $1',
        [email],
      );
      if (userStatus.rows[0].status === 3) {
        const result = await this.dbClient.query(
          `UPDATE users
           SET status = 1
           WHERE email = $1`,
          [email],
        );
        if (result.rowCount === 0) {
          throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
        }
      } else {
        throw new BadRequestException(
          AuthenticationErrors.ACCOUNT_ALREADY_ACTIVE,
        );
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async delete(payload: any) {
    await this.dbClient.query(
      `DELETE
       FROM users
       WHERE id = $1`,
      [payload.id],
    );
    try {
    } catch (error) {
      throw error;
    }
  }
}
