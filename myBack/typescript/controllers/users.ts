import { Request, Response } from 'express';
import db from '../helpers/database';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import Mail from '../helpers/mailer';

import type { UserRegister } from '../types/userTypes';
import type { DefaultResponse } from '../types/responseTypes';

const createUser = async (req: Request, res: Response) => {
    let { username, email, password }: UserRegister = req.body;
    const client = await db.getClient();
    try {
        const salt = await bcrypt.genSalt();
        password = await bcrypt.hash(password, salt);
        await client.query(query.registerUser, [username, email, password]);
        const resBody: DefaultResponse = {
            title: 'Success',
            content: 'Usuario registrado!'
        };
        res.status(200).json(resBody);
        Mail(username, email);
    } catch (err) {
        console.error(err);
        const resBody: DefaultResponse = {
            title: 'Error',
            content: 'No se pudo registrar el usuario. Por favor, intente mas tarde.'
        };
        res.status(503).json(resBody);
    } finally {
        client.release(true);
    }
}

export = {
    createUser
}