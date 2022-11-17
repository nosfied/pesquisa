const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha');
const paths = require('../paths/paths');
const util = require('../util/util');
let request = require('request-promise');


//Plugin para deixar o puppeteer 90% indetectável
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

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

async function pegarCookiesTrf1(){

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
        url: 'https://portal.trf1.jus.br/portaltrf1/servicos/certidao-on-line/acesso-ao-sistema/',
        proxy: super_proxy,
        rejectUnauthorized: false,
        headers: {'User-Agent': user_agent}
    };

    let cookies = await request(options)
    .then(function(data){ console.log("ok, pagina da url"); },
        function(err){ console.error(err); });
        let cookiesTrf3 = cookieJar.getCookieString('https://portal.trf1.jus.br/portaltrf1/servicos/certidao-on-line/acesso-ao-sistema/');
        return cookiesTrf3;
}

exports.trf1 = async (dados) => {

    console.log("TRF1 Processando...");
    const SITE_URL = "https://sistemas.trf1.jus.br/certidao/#/solicitacao";
    const CAPTCHA_SITE_KEY = "6Le8WeUUAAAAAEQ0sNuNgYdqVmklhQCSEKigDDDT";
    const ACTION = "t";
    const CPF = dados.cpf;

    const browser = await puppeteer.launch({
        headless: true,
        executablePath: paths.googleChrome(),
        //userDataDir: paths.perfilChrome()
    });
    let cookie = await pegarCookiesTrf1();
    const cookies = [{name: 'cookie', value: `${cookie}`, domain: 'https://sistemas.trf1.jus.br/certidao/#/solicitacao'}];
    console.log(cookies);

    const page = await browser.newPage();
    try {
        await util.limparArquivosAntigos();
        await page.setCookie(...cookies);
        await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        await page.waitForTimeout(5000);
        await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        //selecionar um tipo de certidão -> clique            
        await page.keyboard.press('Tab', { delay: 5000 });
        await page.keyboard.press('Tab', { delay: 1000 });
        await page.keyboard.press('Enter', { delay: 1000 });
        //escolher opção -> criminal            
        await page.click('#mat-option-2 > span', { delay: 2000 });
        //selecionar um órgão -> clique        
        await page.click('#mat-chip-list-input-0', { delay: 2000 });
        //escolher opção -> regionalizada 1 e 2 grau
        await page.click('#mat-option-19 > span', { delay: 2000 });
        //Pressionando a tecla Tab
        await page.keyboard.press('Tab', { delay: 1000 });
        //Clicar no campo CPF
        await page.click('#mat-input-0', { delay: 2000 });
        //Digitar o número do documento
        await page.keyboard.type(CPF, { delay: 50 });
        // Clicar no botão -> "Emitir certidão"               
        await page.click('body > pgp-root > div > pgp-certidao > pgp-solicitacao-certidao > div > form > div > div > button', { delay: 3000 });
        //await page.waitForNavigation({waitUntil: 'load'});
        await page.waitForTimeout(10000);
        // Elemento presente?
        let paginaCertidao = await page.evaluate(() => {
            const el = document.getElementById('page1');
            if (el)
                return el.tagName;
            else
                return false;
        })
        if (!paginaCertidao) {
            console.log("TRF1: Processo interrompido pelo reCaptcha. Tentando solucionar...");
            const quebrarCaptcha = await page.solveRecaptchas();
            console.log(quebrarCaptcha);
            await page.waitForTimeout(5000);
            //clicar 10x no botão Emitir Certidão - tentativas
            for (let index = 0; index < 6; index++) {
                if(paginaCertidao) continue;
                await page.click('body > pgp-root > div > pgp-certidao > pgp-solicitacao-certidao > div > form > div > div > button', { delay: 8000 });
                console.log(index);                
                await page.waitForTimeout(7000);
                paginaCertidao = await page.evaluate(() => {
                    const el = document.getElementById('page1');
                    if (el){
                        return el.tagName;
                    }else{
                        return false;
                    }
                })                
            }
            
        }
        console.log(paginaCertidao);
        if(paginaCertidao == false){
            console.log("TRF 1: Não foi possível atender o pedido ");
            browser.close();
            return { erro: "Não foi possível atender o pedido" };
        }
        await page.waitForTimeout(3000);
        //Remover botão imprimir e Gerar arquivo pdf                
        await page.$eval('button', el => el.remove());
        let diretorio = await mkdir(paths.files()+`${process.env.BARRA}`+Date.now(), {recursive:true}, (err, dir)=>{
            return dir;
        });
        await page.pdf({ path: `${diretorio}${process.env.BARRA}${CPF}trf1.pdf`, format: 'A4', scale: 0.98 });
        let pasta = diretorio.split(`files${process.env.BARRA}`);
        console.log("Arquivo TRF1, PDF gerado com sucesso.");
        browser.close();
        return { diretorio: pasta[1], cpf: CPF, orgao: 'trf1', documento: 'Certidão de Distribuição, AÇÕES E EXECUÇÕES CÍVEIS E CRIMINAIS' };
    } catch (error) {
        console.log("TRF 1 " + error);
        browser.close();
        return { erro: error }; 
    }

}