import express, {Request, Response} from 'express';

import {userController, userSession} from '../controllers';

export const Router = express.Router({
    strict: true
});

Router.post('/', (req: Request, res: Response) => {
    userController.create(req, res);
});

Router.post('/login', (req: Request, res: Response) => {
    userSession.signIn(req, res);
});

Router.get('/logout', (req: Request, res: Response) => {
    userSession.signOut(req, res);
});