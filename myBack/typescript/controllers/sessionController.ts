import { Request, Response } from 'express';

export abstract class SessionController {
    public abstract signIn(req: Request, res: Response): void;
    public abstract signOut(req: Request, res: Response): void;
}