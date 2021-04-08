import {NextFunction, Request, Response} from 'express';

export abstract class SessionController {
  public abstract signIn(req: Request, res: Response, next: NextFunction): void;
  public abstract signOut(
    req: Request,
    res: Response,
    next: NextFunction
  ): void;
}
