import {NextFunction, Request, Response} from 'express';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import {dbController as db, encrypt, tokenController as jwt} from '../helpers';
import {mailer} from '../helpers';
import {CrudController} from './types/crudController';
import fse from 'fs';

import type {UserRegister} from '../types/userTypes';

export class UserController extends CrudController {
  async create(req: Request, res: Response, next: NextFunction) {
    let {
      name,
      email,
      password,
      address,
      last_name,
      phone,
      document,
    }: UserRegister = req.body;
    const client = await db.getClient();
    try {
      const salt = await bcrypt.genSalt();
      address = address ? encrypt.encrypt(address) : undefined;
      phone = phone ? encrypt.encrypt(phone) : undefined;
      document = document ? encrypt.encrypt(document) : undefined;
      password = await bcrypt.hash(password, salt);
      await client.query(query.registerUser, [
        name,
        last_name,
        document,
        email.toLowerCase(),
        phone,
        address,
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

  async read(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return res.sendStatus(403);
    }
    const client = await db.getClient();
    try {
      const userProfile = await client.query(query.getProfile, [payload.id]);
      const userBets = await client.query(query.getUserBets, [payload.id]);
      res.status(200).json({
        profile: userProfile.rows[0],
        bets: userBets.rows,
      });
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

  update(req: Request, res: Response) {}
  delete(req: Request, res: Response) {}
}
