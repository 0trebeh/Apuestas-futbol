import {NextFunction, Request, Response} from 'express';

export abstract class StatController {
  public abstract getTopScorers(req: Request, res: Response, next: NextFunction): void;
  public abstract getTopTeams(req: Request, res: Response, next: NextFunction): void;
}
