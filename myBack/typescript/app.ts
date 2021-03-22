require('dotenv').config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { UserRouter } from './routers';

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req: Request, response: Response) => {
    response.status(200).send('Hola :)');
});

app.use('/users', UserRouter);

app.listen(port, () => {
    console.log(`Running at port ${port}`);
});