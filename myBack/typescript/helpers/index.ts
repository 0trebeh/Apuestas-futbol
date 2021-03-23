import { DatabaseController } from './database';
import {Mailer} from './mailer';
import {TokenController} from './token';

const mailer = new Mailer();
const tokenController = new TokenController();
const dbController = new DatabaseController();

export {
    mailer,
    tokenController,
    dbController
}