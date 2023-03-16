import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PoolClient } from 'pg';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';
import { AuthenticationErrors } from '../auth/constants/auth-error-messages';
import { UserErrorMessages } from './constant/common/user-error-messages';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(payload: CreateUserDto): Promise<CreateUserDto> {
    // TODO: password is not null and verify comments on table
    try {
      const status = 3;
      const roleId = 2;
      const saltOrRounds = 10;
      const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
      const user = await this.dbClient.query<CreateUserDto>(
        `INSERT INTO users (email, password, username, status, group_id, org_id, role_id, client_id)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
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
      return user.rows[0];
    } catch (error) {
      throw error;
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

  async findOneByEmail(email: string): Promise<any> {
    try {
      const result = await this.dbClient.query<any>(
        `SELECT *
                 FROM users
                 WHERE email = $1`,
        [email],
      );
      if (result.rows.length > 0) {
        return result.rows[0];
      } else {
        throw new NotFoundException(UserErrorMessages.EMAIL_NOT_FOUND);
      }
    } catch (error) {
      throw error;
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
