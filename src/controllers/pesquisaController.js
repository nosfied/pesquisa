const Trf1 = require('../models/trf1Model');
const Trf2 = require('../models/trf2Model');
const Trf3 = require('../models/trf3Model');
const Trf4 = require('../models/trf4Model');
const Trf5 = require('../models/trf5Model');
const path = require('path');

const ERRONAOSELECT = "É preciso selecionar ao menos um documento para pesquisa.";
const ERRONOMECOMPLETO = "É preciso digitar o nome COMPLETO, inclusive com acentos.";
const ERROCPF = "O CPF digitado é inválido.";

exports.trf1 = async (req, res) => {
    
    if(req.body.documento == ""){
        let error = ERRONAOSELECT;
        res.json({erroValid: error});
        return
    }

    if(req.body.nome == ""){
        let error = ERRONOMECOMPLETO;
        res.json({erroValid: error});
        return
    }

    const cpf = new ValidaCPF(req.body.cpf);
    if(!cpf.valida()) {
        let error = ERROCPF;
        res.json({erroValid: error});
        return
    }    

    try {
        const result = await Trf1.trf1(req.body);
        res.json(result);
    } catch (error) {
        res.json({erro: error});
    }
      
}

exports.trf2 = async (req, res) => {
    
    if(req.body.documento == ""){
        let error = ERRONAOSELECT;
        res.json({erroValid: error});
        return
    }

    if(req.body.nome == ""){
        let error = ERRONOMECOMPLETO;
        res.json({erroValid: error});
        return
    }

    const cpf = new ValidaCPF(req.body.cpf);
    if(!cpf.valida()) {
        let error = ERROCPF;
        res.json({erroValid: error});
        return
    }    
      
    try {
        const result = await Trf2.trf2(req.body);
        res.json(result);
    } catch (error) {
        res.json({erro: error});
    }
      
}

exports.trf3 = async (req, res) => {

    if(req.body.documento == ""){
        let error = ERRONAOSELECT;
        res.json({erroValid: error});
        return
    }

    if(req.body.nome == ""){
        let error = ERRONOMECOMPLETO;
        res.json({erroValid: error});
        return
    }

    const cpf = new ValidaCPF(req.body.cpf);
    if(!cpf.valida()) {
        let error = ERROCPF;
        res.json({erroValid: error});
        return
    }    
      
    try {
        const result = await Trf3.trf3(req.body);
        res.json(result);
    } catch (error) {
        res.json({erro: error});
    }
      
}

exports.trf4 = async (req, res) => {

    if(req.body.documento == ""){
        let error = ERRONAOSELECT;
        res.json({erroValid: error});
        return
    }

    if(req.body.nome == ""){
        let error = ERRONOMECOMPLETO;
        res.json({erroValid: error});
        return
    }

    const cpf = new ValidaCPF(req.body.cpf);
    if(!cpf.valida()) {
        let error = ERROCPF;
        res.json({erroValid: error});
        return
    }    
      
    try {
        const result = await Trf4.trf4(req.body);
        res.json(result);
        return
    } catch (error) {
        res.json({erro: error});
    }
      
}

exports.trf5 = async (req, res) => {

    if(req.body.documento == ""){
        let error = ERRONAOSELECT;
        res.json({erroValid: error});
        return
    }

    if(req.body.nome == ""){
        let error = ERRONOMECOMPLETO;
        res.json({erroValid: error});
        return
    }

    const cpf = new ValidaCPF(req.body.cpf);
    if(!cpf.valida()) {
        let error = ERROCPF;
        res.json({erroValid: error});
        return
    }    
      
    try {
        const result = await Trf5.trf5(req.body);
        res.json(result);
    } catch (error) {
        res.json({erro: error});
    }
      
}

exports.download = (req, res) => { 
    let cpf = req.params.cpf;
    let orgao = req.params.orgao;    
    let diretorio = req.params.diretorio;    

    res.download(path.resolve(__dirname, '../','../', 'files')+'/'+diretorio+'/'+cpf+orgao+'.pdf');
}


function ValidaCPF(cpfEnviado) {
    Object.defineProperty(this, 'cpfLimpo', {
      enumerable: true,
      get: function() {
        return cpfEnviado.replace(/\D+/g, '');
      }
    });
  }
  
  ValidaCPF.prototype.valida = function() {
    if(typeof this.cpfLimpo === 'undefined') return false;
    if(this.cpfLimpo.length !== 11) return false;
    if(this.isSequencia()) return false;
  
    const cpfParcial = this.cpfLimpo.slice(0, -2);
    const digito1 = this.criaDigito(cpfParcial);
    const digito2 = this.criaDigito(cpfParcial + digito1);
  
    const novoCpf = cpfParcial + digito1 + digito2;
    return novoCpf === this.cpfLimpo;
  };
  
  ValidaCPF.prototype.criaDigito = function(cpfParcial) {
    const cpfArray = Array.from(cpfParcial);
  
    let regressivo = cpfArray.length + 1;
    const total = cpfArray.reduce((ac, val) => {
      ac += (regressivo * Number(val));
      regressivo--;
      return ac;
    }, 0);
  
    const digito = 11 - (total % 11);
    return digito > 9 ? '0' : String(digito);
  };
  
  ValidaCPF.prototype.isSequencia = function() {
    const sequencia = this.cpfLimpo[0].repeat(this.cpfLimpo.length);
    return sequencia === this.cpfLimpo;
  };