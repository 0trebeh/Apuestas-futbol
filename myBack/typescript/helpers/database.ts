import pg, {Pool} from 'pg';
import {DatabaseControllerObject} from './types/dbControllerType';
import {logger} from '../helpers';

export class DatabaseController extends DatabaseControllerObject {
  pool: Pool;

  constructor() {
    super();
    this.pool = new pg.Pool({
      connectionString: process.env.DBURI,
      max: 20,
      ssl: {
        rejectUnauthorized: false,
      },
      min: 1,
      connectionTimeoutMillis: 20000,
    });
    this.pool.on('error', (err, client) => {
      logger.logger.error(err);
    });
  }

  getClient() {
    return this.pool.connect();
  }
}
