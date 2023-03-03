import { Inject, Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { PoolClient } from 'pg';
import { CreateUserDto } from './dto/create-user.dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(@Inject('PG_CONNECTION') private dbClient: PoolClient) {}

  async create(payload: CreateUserDto) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(payload.password, saltOrRounds);
    await this.dbClient.query(
      `INSERT INTO users (email, password, username, password, status, group_id, org_id, role_id, client_id, rate,
                          quota_percent, lastname, name)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        payload.email,
        hashedPassword,
        payload.username,
        payload.status,
        payload.group_id,
        payload.org_id,
        payload.role_id,
        payload.client_id,
        payload.rate,
        payload.quota_percent,
        payload.lastname,
        payload.name,
      ],
    );
    try {
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
      return result.rows[0];
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
