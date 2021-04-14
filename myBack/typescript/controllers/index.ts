import {UserController} from './users';
import {UserSession} from './session';
import ApiConnection from './api/apiConnection';
import {StatsController} from './stats';

const userController = new UserController();
const userSession = new UserSession();
const apiConnection = new ApiConnection();
const statsController = new StatsController();

export {userController, userSession, apiConnection, statsController};