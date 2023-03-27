const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const paths = require('../paths/paths');
const util = require('../util/util');

//Plugin para deixar o puppeteer 90% indetectável
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const { copyFile } = require('node:fs/promises');
const { unlink } = require('node:fs/promises');
const { mkdir } = require('node:fs/promises');

puppeteer.use(StealthPlugin());

puppeteer.use(
    RecaptchaPlugin({
        provider: {
            id: '2captcha',
            token: `${process.env.KEY}` // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY
        },
        visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
        solveInactiveChallenges: true,
        solveScoreBased: true,
        solveInViewportOnly: false
    })
)

exports.tjsc = async (dados) => {    

    console.log("TJSC Processando...");
    const SITE_URL = "https://esaj.tjsc.jus.br/sco/abrirCadastro.do";
    const SITE_URL2 = "https://cert.tjsc.jus.br/";
    const TIPOS = dados.documento;
    const CPF = dados.cpf;
    const RG = dados.rg;
    const NOME = dados.nome;
    const SEXO = dados.sexo;
    const NASCIMENTO = dados.nascimento[8]+dados.nascimento[9]+dados.nascimento[5]+dados.nascimento[6]+dados.nascimento[0]+dados.nascimento[1]+dados.nascimento[2]+dados.nascimento[3];        
    const NOMEMAE = dados.nomeMae;        
    const NOMEPAI = dados.nomePai;
    const ESTCIVIL = dados.estadoCivil;
    const EMAIL = dados.email;
    const ORGEXP = dados.orgaoExp;
    let resultado = [];

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: paths.googleChrome(),
        userDataDir: paths.perfilChrome(),
        defaultViewport: false,
        ignoreHTTPSErrors: true        
    
    });
    const page = await browser.newPage(); 
                
    try {
        for (const tipo of TIPOS) {
            if(tipo == 'criminal1' || tipo == 'civel1'){
                                
                await util.limparArquivosAntigos();        
                await page.goto(SITE_URL, {waitUntil: 'networkidle2'});
                await page.waitForTimeout(2000);
                await page.click('#form_certidao > div > div:nth-child(1) > div > div > div > input[type=checkbox]:nth-child(3)', { delay: 2000 });
                await page.waitForTimeout(2000);
                await page.click('#form_certidao > div > div:nth-child(2) > div > div > div > input[type=checkbox]:nth-child(3)', { delay: 2000 });
                await page.waitForTimeout(2000);
                await page.click('#form_certidao > div > div:nth-child(3) > div > div > div > input', { delay: 2000 });
                await page.keyboard.type(NOME,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});            
                await page.keyboard.press('ArrowDown', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(CPF,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});            
                await page.keyboard.type(RG,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(ORGEXP,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(ESTCIVIL,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(NOMEMAE,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(NOMEPAI,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(NASCIMENTO,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type('Distrito Federal',{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type('BRASÍLIA',{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type('SPO, QUADRA 3, Lote 5',{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type(EMAIL,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.type('CONCURSO',{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Space', {delay:1000});
                
                
                
                await page.waitForTimeout(2000);
                let telaCaptcha = await page.evaluate(async ()=>{        
                        
                    return document.querySelector("body > div:nth-child(15)").style.visibility;                    
                })
                console.log(telaCaptcha);
            
                if(telaCaptcha == 'visible') {        
                    console.log("TJSC: Processo interrompido pelo Captcha. Tentando solucionar...");            
                    let quebrarCaptcha = await page.solveRecaptchas();
                    console.log(quebrarCaptcha);
                    await page.click('#confirmacaoInformacoes', { delay: 2000 });
                    await page.click('#pbEnviar', { delay: 1000 });                           
                }else{
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Space', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Enter', {delay:1000});
                }                
                await page.waitForTimeout(5000);
                
                // let jaPedido = await page.evaluate(() =>{
                //     return document.getElementById('popupModalDiv');
                // })
                    let atencao = await page.$('body > div.blockUI.blockMsg.blockPage');
                    if(atencao){
                        await page.click('#btnSim', {delay:1000});
                    }
                    await page.waitForTimeout(3000); 
                
                //if(!jaPedido){
                    let nPedido = await page.$eval('body > table:nth-child(4) > tbody > tr > td > form > div:nth-child(2) > table.secaoFormBody > tbody > tr:nth-child(1) > td:nth-child(2) > span', el => el.textContent);
                    let dtPedido = await page.$eval('body > table:nth-child(4) > tbody > tr > td > form > div:nth-child(2) > table.secaoFormBody > tbody > tr:nth-child(2) > td:nth-child(2) > span', el => el.textContent);
                    let cpf = await page.$eval('body > table:nth-child(4) > tbody > tr > td > form > div:nth-child(3) > table.secaoFormBody > tbody > tr:nth-child(4) > td:nth-child(2) > table > tbody > tr > td > span:nth-child(1) > span', el => el.textContent);
        
                    let printPDF = `https://esaj.tjsc.jus.br/sco/realizarDownload.do?entity.nuPedido=${nPedido}&entity.dtPedido=${dtPedido}&entity.tpPessoa=F&entity.nuCpf=${cpf}`;        
                
                    console.log("Arquivo TJSC 1° GRAU, PDF gerado com sucesso.");
                    await page.waitForTimeout(20000);
                    resultado.push({cpf: printPDF, orgao: 'tjsc', documento: 'Certidão de Distribuição, AÇÕES E EXECUÇÕES CRIMINAIS 1° GRAU'});
                //}else{
                    //console.log("Arquivo TJSC 1° GRAU, Já existe um pedido anterior.");
                    //resultado.push({cpf: SITE_URL, orgao: 'tjsc', documento: 'Já existe um pedido anterior para Certidão de Distribuição, AÇÕES E EXECUÇÕES CRIMINAIS 1° GRAU, verifique seu email.'});
                //}                            
        
            }else{
                
                await util.limparArquivosAntigos();
                await page.waitForTimeout(10000);
                await page.goto(SITE_URL2, {waitUntil: 'networkidle2'});        
                if(tipo == 'criminal2'){
                    await page.click('#tipo_modelo', { delay: 2000 });
                    await page.keyboard.press('ArrowDown', {delay:1000});
                    await page.keyboard.press('ArrowDown', {delay:1000});
                    await page.keyboard.press('ArrowDown', {delay:1000});
                    await page.keyboard.press('Enter', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type(NOME,{delay:150});            
                    await page.click('#tipo_pessoa', { delay: 2000 });
                    await page.keyboard.press('ArrowDown', {delay:1000});
                    await page.keyboard.press('Enter', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});            
                    await page.keyboard.type(CPF,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});            
                    await page.keyboard.type(RG,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type(ORGEXP,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type(NOMEMAE,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});        
                    await page.keyboard.press('Tab', {delay:1000});        
                    await page.keyboard.type(NOMEPAI,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});            
                    await page.keyboard.press('Tab', {delay:1000});            
                    await page.keyboard.type(NASCIMENTO,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type(EMAIL,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type('apresentar em concurso público',{delay:150});
                    //Criação de diretório para armazenar arquivos da pesquisa
                    let diretorio = await mkdir(paths.files()+`${process.env.BARRA}`+Date.now(), {recursive:true}, (err, dir)=>{
                        return dir;
                    });
                    let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:80, y:1120, width:270, height:95}, encoding: 'base64'});        
                    //screenshot modo headless
                    //let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:380, y:600, width:240, height:65}, encoding: 'base64'});                    
                    let texto_captcha = await util.resolve_captcha_normal(imagem);
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.type(texto_captcha,{delay:150});
                    await page.keyboard.press('Tab', {delay:1000});
                    await page.keyboard.press('Enter', {delay:1000});
                    await page.waitForTimeout(2000);
                    //Verificação se captcha passou e se a tela de confirmação da certidão está presente
                    let pageElements;
                    for (let index = 0; index < 6; index++) {
                        await page.waitForTimeout(2000);            
                        pageElements = await page.evaluate(() =>{
                            let elementos = document.querySelector('body > div.page-wrapper > div.page-wrapper-row.full-height > div > div > div > div.page-content > div > div > div > div > div.portlet-body > div > div > div > div > div > p:nth-child(3)');
                            if(elementos) return elementos.textContent;
                            return false;
                        })
            
                        if(!pageElements){                           
                            let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:80, y:1120, width:270, height:95}, encoding: 'base64'});        
                            //screenshot modo headless
                            //let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:380, y:600, width:240, height:65}, encoding: 'base64'});
                            let texto_captcha = await util.resolve_captcha_normal(imagem);
                            await page.click('#form_certidao > div > div:nth-child(2) > div > div > div > input', {delay:1000});
                            await page.keyboard.type(NOME,{delay:150});
                            await page.click('#form_certidao > div > div:nth-child(12) > div > div > div > input', {delay:1000, clickCount:2});
                            await page.keyboard.type(texto_captcha,{delay:150});
                            await page.keyboard.press('Tab', {delay:1000});
                            await page.keyboard.press('Enter', {delay:1000});
                            await page.waitForTimeout(2000);
                        }else{
                            continue;
                        }                
                    }                   

                    let el1 = pageElements.split('Pedido:');
                    let el2 = el1[1].split('Tipo');
                    let nPedido = el2[0].trim();
                    let el3 = el2[1].split('consultada:');
                    let cpf = el3[1].trim();

                    let printPDF = `https://cert.tjsc.jus.br/certidao/download?numero=${nPedido}&cpfcnpj=${cpf}`;        
                
                    console.log("Arquivo TJSC 2° GRAU, PDF gerado com sucesso.");
                    resultado.push({cpf: printPDF, orgao: 'tjsc', documento: 'Certidão de Distribuição, AÇÕES E EXECUÇÕES CRIMINAIS 2° GRAU'});

                    //await page.waitForTimeout(3000);
                }
            }
        }
    } catch (error) {        
        console.log("TJSC " + error);
        browser.close();
        return { erro: error, result: resultado };
    }
    browser.close();
    return resultado;
}