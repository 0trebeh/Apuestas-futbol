import express, {NextFunction, Request, Response} from 'express';
import {tournaments} from '../controllers';

export const Router = express.Router({
  strict: true,
});

Router.get(
  '/:tournament/matches',
  (req: Request, res: Response, next: NextFunction) => {
    tournaments.getMatches(req, res, next);
  }
);

Router.get(
  '/prediction/:id',
  (req: Request, res: Response, next: NextFunction) => {
    tournaments.getPrediction(req, res, next);
  }
);

Router.get(
  '/prediction/matches/:id',
  (req: Request, res: Response, next: NextFunction) => {
    tournaments.getPredictionMatches(req, res, next);
  }
);