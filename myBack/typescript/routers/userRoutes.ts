import express from 'express';

import userController from '../controllers/users';

const Router = express.Router();

Router.post('/', userController.createUser);
Router.post('/login', userController.login);

export default Router;