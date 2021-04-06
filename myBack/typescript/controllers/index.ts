import {UserController} from './users';
import {UserSession} from './session';

const userController = new UserController();
const userSession = new UserSession();

export {
    userController,
    userSession,
}