import { Pool, PoolClient } from 'pg';

export abstract class DatabaseControllerObject {
    public abstract pool: Pool;
    public abstract getClient(): Promise<PoolClient>;
}