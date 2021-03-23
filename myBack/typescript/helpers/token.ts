import jwt from 'jsonwebtoken';
import query from './query';

import { dbController as database } from './';

import { TokenControllerObject } from './types/tokenControllerType';

import type { TokenPayload } from '../types/userTypes';

export class TokenController extends TokenControllerObject {

    async invalidToken(token: string): Promise<boolean> {
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

    async getPayload(token: string): Promise<TokenPayload | null> {
        if (!process.env.JWT_SECRET) {
            return null;
        }
        else {
            let invalid = await this.invalidToken(token);
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

    async invalidateToken(token: string): Promise<boolean> {
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
}