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

async function pegarCookies(sitio){

    //implementação e credenciais bright data
    const cookieJar = request.jar();
    request = request.defaults({jar: cookieJar});
    var username = 'lum-customer-hl_31c0867f-zone-unblocker';
    var password = 'f8fx0rhf0tue';
    var port = 22225;
    var user_agent = 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36';
    var session_id = (1000000 * Math.random())|0;
    var super_proxy = 'http://'+username+'-country-br-session-'+session_id+':'+password+'@zproxy.lum-superproxy.io:'+port;
    var options = {
        url: 'https://www.tjdft.jus.br/',
        proxy: super_proxy,
        rejectUnauthorized: false,
        headers: {'User-Agent': user_agent}
    };

    let cookies = await request(options)
    .then(function(data){ console.log("ok, pagina da url"); },
        function(err){ console.error(err); });
        let cookiesTrf3 = cookieJar.getCookieString('https://www.tjdft.jus.br/');
        return cookiesTrf3;
}

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

    const page = await browser.newPage();
    try {     
        await util.limparArquivosAntigos();
        await page.setRequestInterception(true);    
        page.on('request', (request) => {
            const headers = request.headers();
            headers[':authority'] = 'www.tjdft.jus.br';
            headers[':method'] = 'GET';
            headers[':path'] = '/';
            headers[':scheme'] = 'https';
            headers['accept'] = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9';
            headers['accept-encoding'] = 'gzip, deflate, br';
            headers['accept-language'] = 'pt,pt-BR;q=0.9';
            headers['cache-control'] = 'max-age=0';
            headers['cookie'] = 'da07dfacbe3d201227379ca36977cdd5=ebb983ff49866d3b8c095cace321554d; _ga=GA1.1.1380745664.1668565259; acceptCookies=true; _hjSessionUser_1406603=eyJpZCI6ImU0NDgzZDRiLTE5YTAtNTI2Ni1iZTk4LTQzOGZjMGViNmUzMSIsImNyZWF0ZWQiOjE2Njg1NjUyNTk2MTUsImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_1406603=eyJpZCI6Ijc1OTg2MWM1LTFmOTMtNGI0Yi1iODk5LTFkMGFiYmY4M2I2OSIsImNyZWF0ZWQiOjE2Njg2NDQ5MTM5ODMsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga_PTZQJF4TK1=GS1.1.1668647521.7.1.1668647521.0.0.0; _hjIncludedInSessionSample=0';
            headers['referer'] = 'https://www.google.com/';
            headers['sec-ch-ua'] = '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"';
            headers['sec-ch-ua-mobile'] = '?0';
            headers['sec-ch-ua-platform'] = 'Windows';
            headers['sec-fetch-dest'] = 'document';
            headers['sec-fetch-mode'] = 'navigate';
            headers['sec-fetch-site'] = 'cross-site';
            headers['sec-fetch-user'] = '?1';
            headers['upgrade-insecure-requests'] = '1';
            headers['user-agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36';
            
            
            request.continue({
                headers
            });
        });
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