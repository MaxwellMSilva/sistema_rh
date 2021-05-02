const express = require('express');

const routes = express.Router();

const adminController = require('./controllers/adminController');
const departamentosController = require('./controllers/departamentosController');
const funcoesController = require('./controllers/funcoesController');
const funcionariosController = require('./controllers/funcionariosController');

routes.use('/', adminController);
routes.use('/', departamentosController);
routes.use('/', funcoesController);
routes.use('/', funcionariosController);

module.exports = routes;
