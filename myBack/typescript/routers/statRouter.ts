import express, {NextFunction, Request, Response} from 'express';

import {statsController} from '../controllers';

export const StatRouter = express.Router({
  strict: true,
});

StatRouter.get('/:id', (req: Request, res: Response, next: NextFunction) => {
    statsController.read(req, res, next);
});