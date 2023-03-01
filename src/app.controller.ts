import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';
import { PoolClient, QueryResult } from 'pg';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('PG_CONNECTION') private dbConnection: PoolClient,
  ) {}

  @Get()
  async getHello(): Promise<any> {
    const result = await this.dbConnection.query(
      'SELECT * FROM users WHERE id = $1',
      [1],
    );

    console.log(result);
    return result.rows;
  }
}
