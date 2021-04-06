import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response, NextFunction} from 'express';
import {logger} from './helpers';
import cors from 'cors';
import helmet from 'helmet';

import {UserRouter} from './routers';

const app = express();

const port = process.env.PORT || 8000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/users', UserRouter);
app.use(
  (err: any | undefined, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      logger.logger.error(err);
    }
    res.status(err.status ? err.status : 500).json({
      message: err.custom
        ? err.custom
        : 'Something went wrong. Try again later.',
    });
  }
);

app.listen(port, () => {
  console.log(`Running at port ${port}`);
});
