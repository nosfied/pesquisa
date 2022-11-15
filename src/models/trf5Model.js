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
            token: 'd8abbbea75f6ffcdba27b47b05923f39' // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY
        },
        visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
        solveInactiveChallenges: true,
        solveScoreBased: true,
        solveInViewportOnly: false
    })
)

exports.trf5 = async (dados) => {    

    console.log("TRF5 Processando...");
    const SITE_URL = "https://www4.trf5.jus.br/certidoes/";
    const CAPTCHA_SITE_KEY = "";
    const ACTION = "";
    const CPF = dados.cpf;
    const NOME = dados.nome;        

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: paths.googleChrome(), 
        defaultViewport: false,
        ignoreHTTPSErrors: true        
    
    });

    const page = await browser.newPage();
    try {     
        await util.limparArquivosAntigos();    
        await page.goto(SITE_URL, {waitUntil: 'networkidle2'});        
        //await page.waitForSelector('#string_cpf');
        for (let index = 0; index < 10; index++) {
            await page.keyboard.press('Tab', {delay:1000});            
        }
        await page.keyboard.press('Enter', {delay:1000});    
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('ArrowDown', {delay:1000});        
        await page.keyboard.press('ArrowDown', {delay:1000});        
        await page.keyboard.press('Enter', {delay:1000});
        await page.waitForTimeout(6000);
        //await page.click('#form:nome', {delay:1000});
        await page.keyboard.type(NOME,{delay:100});
        await page.keyboard.press('Tab', {delay:1000});
        //await page.click('#form:cpfCnpj', {delay:1000});
        await page.keyboard.type(CPF,{delay:150});
        //Criação de diretório para armazenar arquivos da pesquisa
        let diretorio = await mkdir(paths.files()+`${process.env.BARRA}`+Date.now(), {recursive:true}, (err, dir)=>{
            return dir;
        });
        let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:360, y:370, width:240, height:65}, encoding: 'base64'});
        //screenshot modo headless
        //let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:270, y:375, width:240, height:65}, encoding: 'base64'});        
        let texto_captcha = await util.resolve_captcha_normal(imagem);
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.type(texto_captcha,{delay:150});
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.press('Enter', {delay:1000});
        await page.waitForTimeout(7000);
        //Verificação se captcha passou e se a tela de confirmação da certidão está presente
        let cont = 1;
        while (cont == 1) {            
            await page.waitForTimeout(2000);            
            const confirmacao = await page.evaluate(async ()=>{            
                let confirm = document.querySelector("body > div.ui-dialog.ui-widget.ui-widget-content.ui-corner-all.ui-draggable");
                let tela = confirm.style.display;
                return tela;        
            });

            if(confirmacao != 'block'){                
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Tab', {delay:1000});
                let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:360, y:370, width:240, height:65}, encoding: 'base64'});
                //screenshot modo headless
                //let imagem = await page.screenshot({ path: `${diretorio}${process.env.BARRA}captcha.png`, clip:{x:270, y:375, width:240, height:65}, encoding: 'base64'});
                let texto_captcha = await util.resolve_captcha_normal(imagem);
                await page.keyboard.type(texto_captcha,{delay:150});
                await page.keyboard.press('Tab', {delay:1000});
                await page.keyboard.press('Enter', {delay:1000});
                await page.waitForTimeout(5000);
            }else{
                console.log(confirmacao);
                cont = 0;
            }
        }
        //Clicar em sim para baixar a certidão
        await page.click('#form\\:panelBotoes > a.estilocomand', { delay: 2000 });

        // await page.evaluate(async ()=>{                  
            
        //     jsf.util.chain(this,event,'confirmation.hide();','mojarra.jsfcljs(document.getElementById(\'form\'),{\'form:j_idt71\':\'form:j_idt71\'},\'\')');          
        // });
        await page.waitForTimeout(5000);

        await copyFile(`${paths.dirDownloadPadrao()}${process.env.BARRA}certidaonegativacriminal.pdf`, `${diretorio}${process.env.BARRA}${CPF}trf5.pdf`);
        let pasta = diretorio.split(`files${process.env.BARRA}`);
        console.log("Arquivo TRF5, PDF gerado com sucesso.");
        browser.close();
        await unlink(`${paths.dirDownloadPadrao()}${process.env.BARRA}certidaonegativacriminal.pdf`);
        return {diretorio: pasta[1], cpf: CPF, orgao: 'trf5', documento: 'Certidão de Distribuição, AÇÕES E EXECUÇÕES CÍVEIS E CRIMINAIS'}             

    } catch (error) {        
        console.log("TRF 5 " + error);
        browser.close();
        return { erro: error };
    }

}