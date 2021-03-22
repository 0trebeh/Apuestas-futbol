const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

//inicializaciones
const server = express();

//Middlewares
server.use(cors());
server.use(helmet());
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

//rutas
server.use('/api/users', require('./routes/users'));
server.use('/api/league', require('./routes/league'));

module.exports = server;