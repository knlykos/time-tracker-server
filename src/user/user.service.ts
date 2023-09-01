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
import { DatabaseError, PoolClient } from 'pg';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { AuthenticationErrors } from '../auth/constants/auth-error-messages';
import { UserErrorMessages } from './constant/common/user-error-messages';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { UserDto } from './dto/user.dto/userDto';
import { Client, types } from 'cassandra-driver';
import { UserStatus } from './enums/user-enums';

@Injectable()
export class UserService {
  constructor(@Inject('PLANT43_DB_CASSANDRA') private dbClient: Client) {}

  async create<T>(uuid: string, payload: CreateUserDto): Promise<any> {
    // TODO: password is not null and verify comments on table
    try {
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
      const params = [
        uuid,
        payload.email,
        hashedPassword,
        payload.username,
        UserStatus.NOT_VERIFIED,
        false,
      ];

      const query = this.dbClient.batch(
        [
          {
            query: `INSERT INTO users_by_email (user_id, email, password, username, status, is_system_user)
                                VALUES (?, ?, ?, ?, ?, ?)`,
            params: params,
          },
          {
            query: `INSERT INTO users (user_id, email, password, username, status, is_system_user)
                                VALUES (?, ?, ?, ?, ?, ?)`,
            params: params,
          },
        ],
        { prepare: true },
      );
      const user = await this.dbClient.execute(
        `INSERT INTO users (user_id, email, password, username, status, is_system_user)
                 VALUES (?, ?, ?, ?, ?, ?)`,
        [
          uuid,
          payload.email,
          hashedPassword,
          payload.username,
          UserStatus.NOT_VERIFIED,
          false,
        ],
      );
      // await this.dbClient.execute('COMMIT');
      return user.wasApplied();
      return user.rows[0] as unknown as CreateUserDto;
    } catch (error) {
      console.error(error);
      // await this.dbClient.execute('ROLLBACK');
      // if (error instanceof DatabaseError) {
      //   const message: string = error.message;
      //   if (error.code === '23505') {
      //     if (message.includes('email')) {
      //       throw new ConflictException(UserErrorMessages.EMAIL_ALREADY_IN_USE);
      //     } else if (message.includes('username')) {
      //       throw new ConflictException(
      //         UserErrorMessages.USERNAME_ALREADY_IN_USE,
      //       );
      //     }
      //   }
      // }
      throw new BadRequestException();
    }
  }

  async findOneById(id: number) {
    const result = await this.dbClient.execute(
      `SELECT *
             FROM users
             WHERE id = $1`,
      [id],
    );
    return result.rows;
  }

  async findOneByEmail(email: string): Promise<UserDto> {
    try {
      const query = 'SELECT * FROM users_by_email WHERE email = ?';
      const params = [email];

      const result = await this.dbClient.execute(query, params, {
        prepare: true,
      });
      console.log(result);
      if (result.rows.length > 0) {
        return result.rows[0] as unknown as UserDto;
      } else {
        throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async updatePassword(payload: any) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
    await this.dbClient.execute(
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
      const userStatus = await this.dbClient.execute(
        'SELECT status FROM users WHERE email = $1',
        [email],
      );
      if (userStatus.rows[0].status === 3) {
        const result = await this.dbClient.execute(
          `UPDATE users
                     SET status = 1
                     WHERE email = $1`,
          [email],
        );
        if (result.rows.length === 0) {
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
    await this.dbClient.execute(
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
