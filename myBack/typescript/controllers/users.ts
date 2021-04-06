import {NextFunction, Request, Response} from 'express';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import {dbController as db} from '../helpers';
import {mailer} from '../helpers';
import {CrudController} from './types/crudController';

import type {UserRegister} from '../types/userTypes';

export class UserController extends CrudController {
  async create(req: Request, res: Response, next: NextFunction) {
    let {name, email, password}: UserRegister = req.body;
    const client = await db.getClient();
    try {
      const salt = await bcrypt.genSalt();
      password = await bcrypt.hash(password, salt);
      await client.query(query.registerUser, [
        name,
        email.toLowerCase(),
        password,
      ]);
      res.sendStatus(201);
      mailer.sendMail(name, email);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }
  read(req: Request, res: Response) {}
  update(req: Request, res: Response) {}
  delete(req: Request, res: Response) {}
}
