import {NextFunction, Request, Response} from 'express';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import {dbController as db, encrypt, tokenController as jwt} from '../helpers';
import {mailer} from '../helpers';
import {CrudController} from './types/crudController';
import fse from 'fs';

export class StatsController extends CrudController {
  create(req: Request, res: Response, next: NextFunction) {}

  async read(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return res.sendStatus(403);
    }
    const client = await db.getClient();
    try {
      const id = parseInt(req.params.id);
      const scorers = await client.query(query.getTopScorers, [id]);
      res.status(200).json(scorers.rows);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

  update(req: Request, res: Response) {}
  delete(req: Request, res: Response) {}
}
