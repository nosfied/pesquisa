const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const pesquisaController = require('./src/controllers/pesquisaController');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//Rotas da Pesquisa
route.post('/pesquisa/trf1', loginRequired, pesquisaController.trf1);
route.post('/pesquisa/trf2', loginRequired, pesquisaController.trf2);
route.post('/pesquisa/trf3', loginRequired, pesquisaController.trf3);
route.post('/pesquisa/trf4', loginRequired, pesquisaController.trf4);
route.post('/pesquisa/trf5', loginRequired, pesquisaController.trf5);
route.get('/pesquisa/files/:diretorio/:cpf/:orgao', pesquisaController.download);


module.exports = route;
