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
      const emails = await client.query(query.emailExists, [
        email.toLowerCase(),
      ]);
      if (emails.rowCount > 0) {
        return next({status: 400, custom: 'Email already registered!'});
      }
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

  async setBalance(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return next({status: 403, custom: 'Invalid auth token'});
    }
    const client = await db.getClient();
    try {
      let {bank, ref, acc_number, date, balance} = req.body;
      let results = await client.query(query.paymentByRef, [ref]);
      if (results.rowCount > 0) {
        return next({
          status: 400,
          custom: 'Numero de referencia ya registrado!',
        });
      }
      await client.query('BEGIN');
      await client.query(query.insertPayment, [
        payload.id,
        encrypt.encrypt(acc_number),
        bank,
        ref,
        Number.parseFloat(balance),
        date,
      ]);
      results = await client.query(query.currentBalance, [payload.id]);
      results = await client.query(query.updateBalance, [
        results.rows[0].balance + Number.parseFloat(balance),
        payload.id,
      ]);
      await client.query('COMMIT');
      res.status(200).json({
        balance: results.rows[0].balance,
      });
    } catch (err) {
      await client.query('ROLLBACK');
      next(err);
    } finally {
      client.release(true);
    }
  }
}
