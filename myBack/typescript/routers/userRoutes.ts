import express, {NextFunction, Request, Response} from 'express';

import {userController, userSession} from '../controllers';

export const Router = express.Router({
  strict: true,
});

Router.post('/user', (req: Request, res: Response, next: NextFunction) => {
  userController.create(req, res, next);
});

Router.get('/user', (req: Request, res: Response, next: NextFunction) => {
  userController.read(req, res, next);
});

Router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  userSession.signIn(req, res, next);
});

Router.get('/logout', (req: Request, res: Response, next: NextFunction) => {
  userSession.signOut(req, res, next);
});
