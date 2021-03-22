import pg from 'pg';

const Pool = new pg.Pool({
    connectionString: process.env.DBURI,
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