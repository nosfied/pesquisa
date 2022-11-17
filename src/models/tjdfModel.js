const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const paths = require('../paths/paths');
const util = require('../util/util');
let request = require('request-promise');


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

exports.tjdf = async (dados) => {    

    console.log("TJDF Processando...");
    const SITE_URL = "https://cnc.tjdft.jus.br/solicitacao-externa";
    const sitioParaCookies = 'https://www.tjdft.jus.br/';
    const CPF = dados.cpf;
    const NOME = dados.nome;        
    const NOMEMAE = dados.nomeMae;        
    const NOMEPAI = dados.nomePai;        

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: paths.googleChrome(), 
        defaultViewport: false,
        ignoreHTTPSErrors: true        
    
    });
    let cookie = await util.pegarCookies(sitioParaCookies);
    const cookies = [{name: 'cookie', value: `${cookie}`, domain: 'https://cnc.tjdft.jus.br/solicitacao-externa'}];
    console.log(cookies);

    const page = await browser.newPage();
    try {     
        await util.limparArquivosAntigos();
        await page.setCookie(...cookies);
        await page.goto(SITE_URL, {waitUntil: 'networkidle2'});        
        await page.waitForTimeout(200000);
        await page.keyboard.type(CPF,{delay:150});
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});        
        await page.keyboard.press('Enter', {delay:1000});
        await page.waitForTimeout(2000);
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});            
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.press('Enter', {delay:1000});
        await page.waitForTimeout(3000);
        await page.keyboard.type(NOMEMAE,{delay:150});
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.type(NOMEPAI,{delay:150});
        await page.keyboard.press('Tab', {delay:1000});
        await page.keyboard.press('Enter', {delay:1000});

        await page.waitForTimeout(3000);

        let certidao = await page.evaluate(()=>{
            
            let link1 = document.querySelector("#q-app > div > div > div > div > div.q-card__section.q-card__section--vert > div > div.q-stepper__content.q-panel-parent > div > div > div > div > div > a");
            let link2 = document.querySelector("#q-app > div > div > div > div > div.q-card__section.q-card__section--vert > div > div.q-stepper__content.q-panel-parent > div > div > div > div > div > div.q-gutter-sm > a");
            if(link1){
                return link1.href;
            }
            return link2.href;

        })

        if(certidao){
            
            console.log("Arquivo TJDF, PDF gerado com sucesso.");
        }
        
        browser.close();
        return {cpf: certidao, orgao: 'tjdf', documento: 'CERTIDÃO NEGATIVA DE DISTRIBUIÇÃO (AÇÕES CRIMINAIS)'}             

    } catch (error) {        
        console.log("TJDF " + error);
        browser.close();
        return { erro: error };
    }

}