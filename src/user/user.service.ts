import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

import * as bcrypt from 'bcrypt';
import { DatabaseError, PoolClient, QueryResult } from 'pg';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { AuthenticationErrors } from '../auth/constants/auth-error-messages';
import { UserErrorMessages } from './constant/common/user-error-messages';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UserDto } from './dto/user.dto/userDto';
import { Client, types } from 'cassandra-driver';
import { UserStatusEnum } from './enums/user-enums';
import { AuthSuccessMessages } from '../auth/constants/auth-success-messages';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create<T>(payload: CreateUserDto): Promise<UserDto> {
    // TODO: password is not null and verify comments on table
    try {
      const saltOrRounds = 10; // TODO: move to config
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
      const params = [
        payload.email.toLowerCase(),
        hashedPassword,
        payload.username.toLowerCase(),
        UserStatusEnum.NOT_VERIFIED,
        false,
      ];

      const query = await this.dbClient.query(
        `INSERT INTO users (email, password, username, status, is_system_user)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING *`,
        params,
      );

      return query.rows[0];
    } catch (error) {
      console.log(error);
      if (error instanceof DatabaseError) {
        if (error.code === '23505') {
          throw new ConflictException(
            UserErrorMessages.EMAIL_OR_USERNAME_ALREADY_IN_USE,
          );
        }
      }
      console.log(error.constructor.name);
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneById(user_id: string): Promise<UserDto> {
    console.log(user_id);
    try {
      const result = await this.dbClient.query<UserDto>(
        `SELECT *
         FROM users
         WHERE user_id = $1`,
        [user_id],
      );
      if (result.rows.length > 0) {
        return result.rows[0] as unknown as UserDto;
      } else {
        throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (e) {
      console.log(e);
      throw new NotFoundException(UserErrorMessages.USER_NOT_FOUND);
    }
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const params = [email];

      const result = await this.dbClient.query(query, params);
      if (result.rows.length > 0) {
        // console.log(result);
        return result.rows[0] as unknown as UserDto;
      } else {
        throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (error) {
      console.log(error, 'findOneByEmail');
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
       WHERE user_id = $2`,
      [hashedPassword, payload.id],
    );
    try {
    } catch (error) {
      throw error;
    }
  }

  async updateUserStatus(user_id: string, status: string) {
    try {
      await this.dbClient.query(
        `UPDATE users
         SET status = $1
         WHERE user_id = $2`,
        [status, user_id],
      );
    } catch (e) {
      throw new BadRequestException(
        AuthenticationErrors.ACCOUNT_ALREADY_ACTIVE,
      );
    }
  }

  async activateUser(user_id: string) {
    try {
      const user = await this.findOneById(user_id);

      if (user.status !== UserStatusEnum.NOT_VERIFIED) {
        throw new BadRequestException(
          AuthenticationErrors.ACCOUNT_ALREADY_ACTIVE,
        );
      }
      await this.updateUserStatus(user_id, UserStatusEnum.ACTIVE);
    } catch (e) {
      throw e;
    }
  }

  async delete(payload: any) {
    await this.dbClient.query(
      `DELETE
       FROM users
       WHERE user_id = $1`,
      [payload.id],
    );
    try {
    } catch (error) {
      throw error;
    }
  }
}
