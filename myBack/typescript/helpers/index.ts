import { DatabaseController } from './database';
import {Mailer} from './mailer';
import {TokenController} from './token';
import Logger from './logger';
import query from './query';

const mailer = new Mailer();
const tokenController = new TokenController();
const dbController = new DatabaseController();
const logger = new Logger();

export {mailer, tokenController, dbController, logger, query};