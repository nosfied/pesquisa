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
route.post('/pesquisa/trf1', pesquisaController.trf1);
route.post('/pesquisa/trf3', pesquisaController.trf3);
route.post('/pesquisa/trf2', pesquisaController.trf2);
route.post('/pesquisa/trf4', pesquisaController.trf4);
route.post('/pesquisa/trf5', pesquisaController.trf5);
route.post('/pesquisa/tjdf', pesquisaController.tjdf);
route.post('/pesquisa/tjms', pesquisaController.tjms);
route.post('/pesquisa/tjsp', pesquisaController.tjsp);
route.post('/pesquisa/tjsc', pesquisaController.tjsc);
route.post('/pesquisa/tjrs', pesquisaController.tjrs);
route.post('/pesquisa/tjba', pesquisaController.tjba);
route.post('/pesquisa/tjpi', pesquisaController.tjpi);
route.post('/pesquisa/tjal', pesquisaController.tjal);
route.post('/pesquisa/tjap', pesquisaController.tjap);
route.post('/pesquisa/tjce', pesquisaController.tjce);
route.post('/pesquisa/tjes', pesquisaController.tjes);
route.post('/pesquisa/tjgo', pesquisaController.tjgo);
route.post('/pesquisa/tjrr', pesquisaController.tjrr);
route.post('/pesquisa/tjto', pesquisaController.tjto);
route.post('/pesquisa/tjro', pesquisaController.tjro);
route.post('/pesquisa/tjam', pesquisaController.tjam);
route.post('/pesquisa/tjac', pesquisaController.tjac);
route.post('/pesquisa/tjmt', pesquisaController.tjmt);
route.post('/pesquisa/tjpe', pesquisaController.tjpe);
route.post('/pesquisa/tjma', pesquisaController.tjma);
route.post('/pesquisa/tjse', pesquisaController.tjse);
route.post('/pesquisa/tjrn', pesquisaController.tjrn);
route.post('/pesquisa/tjpb', pesquisaController.tjpb);
route.post('/pesquisa/tjpa', pesquisaController.tjpa);
//Polícia Federal
route.post('/pesquisa/acpf', pesquisaController.acpf);
//TSE
route.post('/pesquisa/ctse', pesquisaController.ctse);
//TCU
route.post('/pesquisa/ctcu', pesquisaController.ctcu);
//Receita Federal
route.post('/pesquisa/crf', pesquisaController.crf);
//STM
route.post('/pesquisa/stm', pesquisaController.stm);

route.get('/pesquisa/enviada/:email', loginRequired, pesquisaController.certidaoEnviada);
route.get('/pesquisa/files/:diretorio/:cpf/:orgao', pesquisaController.download);


module.exports = route;
