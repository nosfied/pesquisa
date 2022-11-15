const paths = require('../paths/paths');
const { readdir } = require('node:fs');
const { rm } = require('node:fs/promises');
let request = require('request-promise');



exports.limparArquivosAntigos = async function () {
    
    readdir(paths.files(), async (err, files)=>{
        for (const file of files){
            
            if(file < (Date.now() - 60*60*12*1000)){
                rm(paths.files()+'\\'+file, {recursive:true, force:true});
            }                
        } 
    });
}

//Função para aguardar intervalo de tempo    
async function sleep(millisecondsCount) {
    if (!millisecondsCount) {
        return;
    }
    return new Promise(resolve => setTimeout(resolve, millisecondsCount)).catch();
}

//Função que faz requição para o 2captcha
async function curl(options){

    return new Promise((resolve, reject) => {
        request(options, (err, res, body) => {
            if(err)
                return reject(err);
            resolve(body);    
        });
    });

}

exports.resolve_captcha_normal = async function (imagem){
    
    const KEY_2CAPTCHA = 'd8abbbea75f6ffcdba27b47b05923f39';
    let url = `http://2captcha.com/in.php`;    
    let body = {
        "method": "base64",
        "key": KEY_2CAPTCHA,
        "body": imagem        
    };
    body = JSON.stringify(body);

    let response = await curl({
        url: url,
        method: "POST",
        body: body
    });
        
    let resposta = response.split('|');                       
    let captcha_id = resposta[1];
    console.log("Deu certo, id captcha: "+captcha_id);  
        
    while (1) {
            
        await sleep(10000);
        console.log("Verificando se o Captcha está pronto...");

        let result = await curl({
        url: `http://2captcha.com/res.php?key=d8abbbea75f6ffcdba27b47b05923f39&action=get&id=${captcha_id}&json=true`,
        method: "GET"
        });
        let resultado = JSON.parse(result);
        console.log(resultado);

        if(resultado.status == 1)
            return resultado.request;
        else if(resultado.request != 'CAPCHA_NOT_READY')
            return false;
    }      

}