import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PoolClient, QueryResult } from 'pg';
import { Client } from 'cassandra-driver';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('PLANT43_DB_CASSANDRA') private dbConnection: Client,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const result = await this.dbConnection.execute(
      'SELECT * FROM users WHERE id = $1',
      [1],
    );

    console.log(result);
    return result.rows;
  }
}
