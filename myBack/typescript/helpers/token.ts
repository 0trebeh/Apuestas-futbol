import jwt from 'jsonwebtoken';
import database from './database';
import query from './query';

import type { TokenPayload } from '../types/userTypes';

const invalidToken = async (token: string) => {
    let client = await database.getClient();
    try {
        let results = await client.query(query.invalidToken, [token]);
        if (results.rowCount < 1) { return false; }
        return true;
    } catch (err) {
        console.error(err);
        return true;
    } finally {
        client.release(true);
    }
}

const getPayload = async (token: string): Promise<TokenPayload | null> => {
    if (!process.env.JWT_SECRET) {
        return null;
    }
    else {
        let invalid = await invalidToken(token);
        if (invalid) {
            return null;
        }
        else {
            try {
                const verified = jwt.verify(token, process.env.JWT_SECRET);
                return verified as TokenPayload;
            } catch (error) {
                console.error(error);
                return null;
            }
        }
    }
}

const invalidateToken = async (token: string) => {
    let client = await database.getClient();
    try {
        await client.query(query.invalidateToken, [token]);
        return true;
    } catch (err) {
        console.error(err);
        return false;
    } finally {
        client.release(true);
    }
}

export = { getPayload, invalidateToken }