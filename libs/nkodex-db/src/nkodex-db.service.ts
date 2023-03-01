import { Injectable } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class NkodexDbService {
  private pool: Pool;

  getConnection(config: PoolConfig) {
    this.pool = new Pool(config);
    return this.pool;
  }
}
