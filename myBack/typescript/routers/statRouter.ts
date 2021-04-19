import express, {NextFunction, Request, Response} from 'express';

import {statsController} from '../controllers';

export const Router = express.Router({
  strict: true,
});

Router.get('/topScore/:id', (req: Request, res: Response, next: NextFunction) => {
    statsController.getTopScorers(req, res, next);
});

Router.get('/topTeams/:id', (req: Request, res: Response, next: NextFunction) => {
  statsController.getTopTeams(req, res, next);
});