const express = require('express');
const route = express.Router();

const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const pesquisaController = require('./src/controllers/pesquisaController');

const { loginRequired } = require('./src/middlewares/middleware');

// Rotas da home
route.get('/', homeController.index);
route.get('/prfstart', homeController.index);

// Rotas de Login
route.get('/login/index', loginController.index);
route.post('/login/login', loginController.login);
route.get('/login/logout', loginController.logout);

//Rotas da Pesquisa
route.post('/pesquisa/trf1', checkCsrfError, loginRequired, pesquisaController.trf1);
route.post('/pesquisa/trf3', checkCsrfError, loginRequired, pesquisaController.trf3);
route.post('/pesquisa/trf2', checkCsrfError, loginRequired, pesquisaController.trf2);
route.post('/pesquisa/trf4', checkCsrfError, loginRequired, pesquisaController.trf4);
route.post('/pesquisa/trf5', checkCsrfError, loginRequired, pesquisaController.trf5);
route.post('/pesquisa/tjdf', checkCsrfError, loginRequired, pesquisaController.tjdf);
route.post('/pesquisa/tjms', checkCsrfError, loginRequired, pesquisaController.tjms);
route.post('/pesquisa/tjsp', checkCsrfError, loginRequired, pesquisaController.tjsp);
route.post('/pesquisa/tjsc', checkCsrfError, loginRequired, pesquisaController.tjsc);
route.post('/pesquisa/tjrs', checkCsrfError, loginRequired, pesquisaController.tjrs);
route.post('/pesquisa/tjba', checkCsrfError, loginRequired, pesquisaController.tjba);
route.post('/pesquisa/tjpi', checkCsrfError, loginRequired, pesquisaController.tjpi);
route.post('/pesquisa/tjal', checkCsrfError, loginRequired, pesquisaController.tjal);
route.post('/pesquisa/tjap', checkCsrfError, loginRequired, pesquisaController.tjap);
route.post('/pesquisa/tjce', checkCsrfError, loginRequired, pesquisaController.tjce);
route.post('/pesquisa/tjes', checkCsrfError, loginRequired, pesquisaController.tjes);
route.post('/pesquisa/tjgo', checkCsrfError, loginRequired, pesquisaController.tjgo);
route.post('/pesquisa/tjrr', checkCsrfError, loginRequired, pesquisaController.tjrr);
route.post('/pesquisa/tjto', checkCsrfError, loginRequired, pesquisaController.tjto);
route.post('/pesquisa/tjro', checkCsrfError, loginRequired, pesquisaController.tjro);
route.post('/pesquisa/tjam', checkCsrfError, loginRequired, pesquisaController.tjam);
route.post('/pesquisa/tjac', checkCsrfError, loginRequired, pesquisaController.tjac);
route.post('/pesquisa/tjmt', checkCsrfError, loginRequired, pesquisaController.tjmt);
route.post('/pesquisa/tjpe', checkCsrfError, loginRequired, pesquisaController.tjpe);
route.post('/pesquisa/tjma', checkCsrfError, loginRequired, pesquisaController.tjma);
route.post('/pesquisa/tjse', checkCsrfError, loginRequired, pesquisaController.tjse);
route.post('/pesquisa/tjrn', checkCsrfError, loginRequired, pesquisaController.tjrn);
route.post('/pesquisa/tjpb', checkCsrfError, loginRequired, pesquisaController.tjpb);
route.post('/pesquisa/tjpa', checkCsrfError, loginRequired, pesquisaController.tjpa);
//Polícia Federal
route.post('/pesquisa/acpf', checkCsrfError, loginRequired, pesquisaController.acpf);
//TSE
route.post('/pesquisa/ctse', checkCsrfError, loginRequired, pesquisaController.ctse);
//TCU
route.post('/pesquisa/ctcu', checkCsrfError, loginRequired, pesquisaController.ctcu);
//Receita Federal
route.post('/pesquisa/crf', checkCsrfError, loginRequired, pesquisaController.crf);
//STM
route.post('/pesquisa/stm', checkCsrfError, loginRequired, pesquisaController.stm);

route.get('/pesquisa/enviada/:email', loginRequired, pesquisaController.certidaoEnviada);
route.get('/pesquisa/files/:diretorio/:cpf/:orgao', pesquisaController.download);


module.exports = route;
