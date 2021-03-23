import pg, { Pool } from 'pg';
import { DatabaseControllerObject } from './types/dbControllerType';

export class DatabaseController extends DatabaseControllerObject {
    pool: Pool;

    constructor() {
        super();
        this.pool = new pg.Pool({
            connectionString: process.env.DBURI,
            max: 20,
            ssl: {
                rejectUnauthorized: false
            }
        })
    }

    getClient() {
        return this.pool.connect();
    }
}