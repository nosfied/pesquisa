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
            token: `${process.env.KEY}` // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY
        },
        visualFeedback: true, // colorize reCAPTCHAs (violet = detected, green = solved)
        solveInactiveChallenges: true,
        solveScoreBased: true,
        solveInViewportOnly: false
    })
)

exports.trf1 = async (dados) => {

    const data = new Date;
    console.log("TRF1 Processando... " + data);
    const SITIOCOOKIES = 'https://portal.trf1.jus.br/portaltrf1/pagina-inicial.htm';
    const SITE_URL = "https://sistemas.trf1.jus.br/certidao/#/solicitacao";
    const CAPTCHA_SITE_KEY = "6Le8WeUUAAAAAEQ0sNuNgYdqVmklhQCSEKigDDDT";
    const ACTION = "t";
    const CPF = dados.cpf;
    let resultado = [];        

    const browser = await puppeteer.launch({
        headless: false,
        executablePath: paths.googleChrome(),
        //userDataDir: paths.perfilChrome()
    });
    const context = await browser.createIncognitoBrowserContext();
    const page = await context.newPage();
    try {
        await util.limparArquivosAntigos();
        //await page.setCookie(...cookies);        
        await page.goto(SITE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
        //escolher opção -> criminal            
        await page.click('#mat-select-0 > div > div.mat-select-value.ng-tns-c86-2 > span', { delay: 2000 });
        //selecionar um órgão -> clique        
        await page.click('#mat-option-2 > span', { delay: 2000 });
        //escolher opção -> regionalizada 1 e 2 grau
        await page.click('#mat-chip-list-input-0', { delay: 2000 });
        await page.waitForTimeout(3000);
        await page.click('#mat-option-19 > span', { delay: 2000 });
        await page.waitForTimeout(2000);
        //Clicar no campo CPF
        await page.click('body > pgp-root > mat-drawer-container > mat-drawer-content > pgp-certidao > div > div > pgp-solicitacao-certidao > mat-card.mat-card.mat-focus-indicator.first-card.mat-elevation-z12 > mat-card-title > mat-card-title', { delay: 2000 });
        await page.click('#mat-input-0', { delay: 2000 });
        //Digitar o número do documento
        await page.keyboard.type(CPF, { delay: 200 });
        // Clicar no botão -> "Emitir certidão"               
        await page.click('body > pgp-root > mat-drawer-container > mat-drawer-content > pgp-certidao > div > div > pgp-solicitacao-certidao > mat-card.mat-card.mat-focus-indicator.first-card.mat-elevation-z12 > form > mat-card-actions > div > button > span', { delay: 3000 });
        await page.waitForTimeout(20000);
        // Elemento presente?
        let botaoPaginaCertidao = await page.$x('/html/body/pgp-root/mat-drawer-container/mat-drawer-content/pgp-certidao/div/div/pgp-certidao-viewer/div/button');
        if (botaoPaginaCertidao == '') {
            console.log("TRF1: Processo interrompido pelo reCaptcha. Tentando solucionar...");
            const quebrarCaptcha = await page.solveRecaptchas();
            //console.log(quebrarCaptcha);
            await page.waitForTimeout(5000);
            for (let index = 0; index < 8; index++) {
                if (botaoPaginaCertidao != '') continue;                
                await page.click('body > pgp-root > mat-drawer-container > mat-drawer-content > pgp-certidao > div > div > pgp-solicitacao-certidao > mat-card.mat-card.mat-focus-indicator.first-card.mat-elevation-z12 > form > mat-card-actions > div > button > span', { delay: 2000 });
                console.log(index);
                await page.waitForTimeout(20000);
                botaoPaginaCertidao = await page.$x('/html/body/pgp-root/mat-drawer-container/mat-drawer-content/pgp-certidao/div/div/pgp-certidao-viewer/div/button');
            }

        }
        console.log(botaoPaginaCertidao);
        if(botaoPaginaCertidao == ''){
            console.log("TRF 1: Não foi possível atender o pedido ");
            browser.close();
            return { erro: "Não foi possível atender o pedido", result: resultado };
        }
        await page.waitForTimeout(3000);
        //Remover botão imprimir e Gerar arquivo pdf
        let diretorio = await mkdir(paths.files()+`${process.env.BARRA}`+Date.now(), {recursive:true}, (err, dir)=>{
            return dir;
        });
        await page.pdf({ path: `${diretorio}${process.env.BARRA}${CPF}trf1.pdf`, format: 'A4', scale: 0.98, pageRanges: '2' });
        let pasta = diretorio.split(`files${process.env.BARRA}`);
        console.log("Arquivo TRF1, PDF gerado com sucesso.");
        browser.close();
        resultado.push({ diretorio: pasta[1], cpf: CPF, orgao: 'trf1', documento: 'Certidão, AÇÕES E EXECUÇÕES CRIMINAIS 1° e 2° GRAUS' });
        return resultado;
    } catch (error) {
        console.log("TRF 1 " + error);
        browser.close();
        return { erro: error, result: resultado };
    }

}