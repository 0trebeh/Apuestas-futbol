import {NextFunction, Request, Response} from 'express';
import query from '../helpers/query';
import bcrypt from 'bcrypt';
import {dbController as db, encrypt, tokenController as jwt} from '../helpers';
import {mailer} from '../helpers';
import {StatController} from './types/statsControllers';
import fse from 'fs';

export class StatsController extends StatController {

  async getTopScorers(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return res.sendStatus(403);
    }
    const client = await db.getClient();
    try {
      const id = parseInt(req.params.id);
      const scorers = await client.query(query.getTopScorers, [id]);
      let top = [];
      for (let i = 0; i < scorers.rows.length; i++) {
        let object = Object.assign({top: i+1}, scorers.rows[i]);
        top.push(object);
      }
      res.status(200).json(top);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

  async getTopTeams(req: Request, res: Response, next: NextFunction) {
    const {authorization} = req.headers;
    const payload = await jwt.getPayload(authorization);
    if (!payload) {
      return res.sendStatus(403);
    }
    const client = await db.getClient();
    try {
      const id = parseInt(req.params.id);
      const team = await client.query(query.getTopTeams, [id]);
      let top = [];
      for (let i = 0; i < team.rows.length; i++) {
        top.push( Object.assign({top: i+1}, team.rows[i]));
      }
      res.status(200).json(top);
    } catch (err) {
      next(err);
    } finally {
      client.release(true);
    }
  }

}
