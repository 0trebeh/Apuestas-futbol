import { Request, Response } from 'express';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { dbController as db } from '../helpers';

import { mailer, tokenController } from '../helpers';

import { CrudController } from './crudController';
import { SessionController } from './sessionController';

import type { UserRegister, TokenPayload, UserLogin } from '../types/userTypes';
import type { DefaultResponse, LoginSuccess } from '../types/responseTypes';

export class UserController extends CrudController {
    async create(req: Request, res: Response) {
        let { name, email, password }: UserRegister = req.body;
        const client = await db.getClient();
        try {
            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);
            await client.query(query.registerUser, [name, email, password]);
            const resBody: DefaultResponse = {
                title: 'Success',
                content: 'Usuario registrado!'
            };
            res.status(200).json(resBody);
            mailer.sendMail(name, email);
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
    read(req: Request, res: Response) {

    }
    update(req: Request, res: Response) {

    }
    delete(req: Request, res: Response) {

    }
}

export class UserSession extends SessionController {
    async signIn(req: Request, res: Response) {
        if (!process.env.JWT_SECRET) {
            const resBody: DefaultResponse = {
                title: 'Error',
                content: 'Token secret undefined'
            }
            res.status(500).json(resBody);
        }
        else {
            const { username, password }: UserLogin = req.body;
            const client = await db.getClient();
            try {
                let results = await client.query(query.login, [username]);
                if (results.rowCount > 0) {
                    const same = await bcrypt.compare(password, results.rows[0].password);
                    if (same) {
                        const payload: TokenPayload = {
                            id: results.rows[0].user_id,
                            username: username
                        }
                        const token = jwt.sign(payload, process.env.JWT_SECRET);
                        const resBody: LoginSuccess = {
                            title: 'Success',
                            content: 'Inicio de sesion exitoso!',
                            token: token
                        }
                        res.status(200).json(resBody);
                    }
                    else {
                        const resBody: DefaultResponse = {
                            title: 'Error',
                            content: 'Contraseña incorrecta!'
                        }
                        res.status(400).json(resBody);
                    }
                }
                else {
                    const resBody: DefaultResponse = {
                        title: 'Error',
                        content: 'Nombre de usuario incorrecto!'
                    }
                    res.status(400).json(resBody);
                }
            } catch (err) {
                console.error(err);
                const resBody: DefaultResponse = {
                    title: 'Error',
                    content: 'No se pudo procesar la informacion. Por favor, intente de nuevo mas tarde.'
                }
                res.status(503).json(resBody);
            } finally {
                client.release(true);
            }
        }
    }

    async signOut(req: Request, res: Response) {
        const token = req.headers.authorization;
        if (!token) {
            const resBody: DefaultResponse = {
                title: 'Error',
                content: 'Token missing'
            }
            res.status(400).json(resBody);
        }
        else {
            const invalidated = await tokenController.invalidateToken(token);
            if (invalidated) {
                const resBody: DefaultResponse = {
                    title: 'Success',
                    content: 'Sesion cerrada exitosamente.'
                }
                res.status(200).json(resBody);
            }
            else {
                const resBody: DefaultResponse = {
                    title: 'Error',
                    content: 'Error eliminando la sesion. Por favor, intente mas tarde.'
                }
                res.status(500).json(resBody);
            }
        }
    }
}