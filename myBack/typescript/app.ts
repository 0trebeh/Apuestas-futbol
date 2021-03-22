require('dotenv').config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import userRoutes from './routers/userRoutes';

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());
app.use((req, resp, next) => {
    next()
}, cors({ maxAge: 84600 }));
app.use(express.json());

app.get('/', (req: Request, response: Response) => {
    response.status(200).send('Hola :)');
});

app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Running at port ${port}`);
});