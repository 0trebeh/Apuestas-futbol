import Express, {NextFunction, Request, Response} from 'express';
import {bet} from '../controllers';

export const Router = Express.Router({
  strict: true,
});

Router.post('/bet', (req: Request, res: Response, next: NextFunction) => {
  bet.create(req, res, next);
});

Router.delete('/bet/:id', (req: Request, res: Response, next: NextFunction) => {
  bet.Delete(req, res, next);
});

Router.get(
  '/notifications',
  (req: Request, res: Response, next: NextFunction) => {
    bet.Notifications(req, res, next);
  }
);

Router.get('/report', (req: Request, res: Response, next: NextFunction) => {
  bet.Report(req, res, next);
});