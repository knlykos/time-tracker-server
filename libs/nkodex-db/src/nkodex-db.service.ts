import { Injectable } from '@nestjs/common';
import { Pool, PoolConfig } from 'pg';

@Injectable()
export class NkodexDbService {
  private pool: Pool;

  getConnection(config: PoolConfig) {
    this.pool = new Pool(config);
    return this.pool;
  }

  async runQueryInTransaction(transactionFn, promise) {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      await transactionFn(client);
      if (promise) {
        await promise;
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
