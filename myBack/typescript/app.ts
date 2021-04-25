import dotenv from 'dotenv';
dotenv.config();
import express, {Request, Response, NextFunction} from 'express';
import {logger} from './helpers';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import multer from 'multer';
import {UserRouter, StatsRouter, TournamentRouter, BetRouter} from './routers';
import {apiConnection} from './controllers';

const app = express();
const port = process.env.PORT || 8000;
const form = multer();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'default-src': ["'self'", '*'],
        scriptSrc: [
          "'self'",
          "'unsafe-eval'",
          'https://kit.fontawesome.com',
          "'unsafe-inline'",
        ],
        'object-src': ["'none'"],
        'connect-src': [
          'https://ka-f.fontawesome.com',
          'https://fap-api.herokuapp.com',
        ],
        'style-src': ["'unsafe-inline'", "'self'"],
        'font-src': ['https://ka-f.fontawesome.com'],
      },
    },
  })
);
app.use(cors());
app.use(express.json());
app.use(form.none());

app.use(express.static(path.join(__dirname, '../build')));

app.use('/users', UserRouter);
app.use('/tournaments', TournamentRouter);
app.use('/bets', BetRouter);
app.use('/stats', StatsRouter);

app.get('/*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

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
