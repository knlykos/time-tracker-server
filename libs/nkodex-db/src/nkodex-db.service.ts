import { Injectable } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class NkodexDbService {
  pool: Pool;

  getConnection() {
    this.pool = new Pool({
      host: 'db.nkodex.dev',
      user: 'postgres',
      password: 'Kine123..!!',
      database: 'nkodex_timetracker',
      max: 20,
    });
    return this.pool;
  }
}
