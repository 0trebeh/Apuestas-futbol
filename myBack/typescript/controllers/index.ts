import {UserController} from './users';
import {UserSession} from './session';
import ApiConnection from './api/apiConnection';
import Tournaments from './tournaments';
import Bet from './bets';

const userController = new UserController();
const userSession = new UserSession();
const apiConnection = new ApiConnection();
const tournaments = new Tournaments();
const bet = new Bet();

export {userController, userSession, apiConnection, tournaments, bet};
