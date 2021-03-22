const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const userRoutes = require('./routes/users');

//inicializaciones
const server = express();

//Middlewares
server.use(cors({origin: 'http://localhost:3000'}));
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//rutas
server.use('/api/users', userRoutes);
server.use('/api/league', require('./routes/league'));

module.exports = server;