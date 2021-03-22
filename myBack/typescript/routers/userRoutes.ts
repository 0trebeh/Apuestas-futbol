import express from 'express';
import cors from 'cors';
import userController from '../controllers/users';

const Router = express.Router();

Router.post('/', cors(), userController.createUser);
Router.post('/login', userController.login);

export default Router;