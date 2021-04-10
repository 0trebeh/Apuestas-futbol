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

  public generateValues(
    rows: number,
    parameters: number,
    nowIndex?: number
  ): string {
    let values: string = '';
    let count: number = 0;
    for (let i = 0; i < rows; i++) {
      values += '(';
      for (let n = 0; n < parameters; n++) {
        if (n > 0 && n <= parameters - 1) {
          values += ', ';
        }
        if (nowIndex !== undefined && nowIndex === n) {
          values += 'NOW()';
          continue;
        }
        values += `$${++count}`;
      }
      values += ')';
      if (i !== rows - 1) {
        values += ', ';
      }
    }
    return values;
  }
}
