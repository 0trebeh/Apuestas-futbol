import pg from 'pg';

const Pool = new pg.Pool({
    connectionString: process.env.DATABASE_URI,
    max: 20,
    ssl: {
        rejectUnauthorized: false
    }
});

const getClient = () => {
    return Pool.connect();
}

export = {
    getClient
}