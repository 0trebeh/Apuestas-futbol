import {TokenPayload, UserLogin} from '../types/userTypes';
import {SessionController} from './types/sessionController';
import {NextFunction, Request, Response} from 'express';
import {dbController as db, query, tokenController} from '../helpers';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class UserSession extends SessionController {
  async signIn(req: Request, res: Response, next: NextFunction) {
    if (!process.env.JWT_SECRET) {
      return next('Token secret undefined');
    } else {
      const {email, password}: UserLogin = req.body;
      const client = await db.getClient();
      try {
        let results = await client.query(query.login, [email.toLowerCase()]);
        if (results.rowCount > 0) {
          const same = await bcrypt.compare(password, results.rows[0].password);
          if (same) {
            const payload: TokenPayload = {
              id: results.rows[0].user_id,
              username: results.rows[0].username,
            };
            const token = jwt.sign(payload, process.env.JWT_SECRET);
            res.status(200).json({
              token: token,
              name: results.rows[0].username,
            });
          } else {
            next({custom: 'Contraseña incorrecta.', status: 403});
          }
        } else {
          next({custom: 'Correo no existe.', status: 404});
        }
      } catch (err) {
        next(err);
      } finally {
        client.release(true);
      }
    }
  }

  async signOut(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
      next({
        custom: 'No hay una sesion activa!',
        msg: 'Token missing',
        status: 401,
      });
    } else {
      const invalidated = await tokenController.invalidateToken(token);
      if (invalidated) {
        res.sendStatus(200);
      } else {
        res.sendStatus(500);
      }
    }
  }
}
