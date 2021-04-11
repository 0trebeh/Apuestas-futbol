import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response, NextFunction} from 'express';
import {logger} from './helpers';
import cors from 'cors';
import helmet from 'helmet';
import multer from 'multer';
import {UserRouter} from './routers';
import {apiConnection} from './controllers';

const app = express();
const port = process.env.PORT || 8000;
const form = multer();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(form.none());

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
  apiConnection.fetchCycle();
});
