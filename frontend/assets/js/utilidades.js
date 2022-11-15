let btLimpar = document.getElementById('btLimpar');
btLimpar.addEventListener('click', async (event)=>{
    event.preventDefault();
    document.location.reload();
})

let btProcessar = document.getElementById('btProcessar');
btProcessar.addEventListener('click', (event) =>{
    event.preventDefault();
    let botoesOrgao = document.getElementsByClassName('btOrgao');
    let selecionado = false;
    for (const btOrgao of botoesOrgao) {
        let boxs = document.getElementsByClassName(btOrgao.getAttribute('opcoes'))
        for (const bx of boxs) {
            let select = bx.getAttribute('select');
            console.log(select);
            if(select != '0'){
                selecionado = true;
            }
            if(selecionado == true) btOrgao.click();
        }
        selecionado = false;
    }
})


// Código envolvendo os botões e linhas de resultados
let botoes = document.getElementsByClassName('btnList');
for (const bt of botoes) {
    
bt.addEventListener('click', () =>{
    let opcoes = document.getElementById(bt.getAttribute('name'));
    if(opcoes.getAttribute('visibilidade') == 'nao'){
        opcoes.classList.remove('opcaoOculta');
        opcoes.setAttribute('visibilidade', 'sim');
        opcoes.style.backgroundColor = '#83b8e0';            
        bt.parentElement.parentElement.parentElement.classList.add('opcaoOculta');
        return;
    }

})
}
//funcionalidade para fechar as opções órgãos para pesquisa
let fechar = document.getElementsByClassName('fechar');
for (const fx of fechar) {
    fx.addEventListener('click', function(event){
        event.preventDefault();
        let cardOpcoes = fx.parentElement;
        let linha = cardOpcoes.parentElement;
        linha.parentElement.parentElement.parentElement.parentElement.classList.add('opcaoOculta');
        linha.parentElement.parentElement.parentElement.parentElement.setAttribute('visibilidade', 'nao');
        linha.parentElement.parentElement.parentElement.parentElement.previousElementSibling.classList.remove('opcaoOculta');
        
    });
}


// Código que marca as caixas de seleção de opções das certidões como selecionadas - 0 ou 1
let boxs = document.getElementsByClassName('box');
for (const box of boxs) {
    box.addEventListener('click', ()=>{
        let bx = box.getAttribute('select');
        if(bx == 0){
            box.setAttribute('select', '1');
        }else{
            box.setAttribute('select', '0');            
        }
    })
}

// Código para abrir a url diretamente do órgão em nova aba.
function linkEmNovaAba() {
    let linksManual = document.getElementsByClassName('linkManual');
    for (const link of linksManual) {
        let linkManual = link.getAttribute('href');
        link.addEventListener('click', (event) => {
            event.preventDefault();
            var win = window.open(linkManual, '_blank');
            win.focus();
        })
    }
}

function carregaResult(result, linha, sitio) {
    const linhaResultado = document.getElementById(linha);
    let org = linha.split('x')     
    if(!result.erroValid){
        if(!result.erro){
            if(result.cpf.length > 15){
                linhaResultado.innerHTML = `<td colspan="2"><p class="msgSucesso">${result.documento}</p></td>
                <td><a href="${result.cpf}">Download</a></td> `
            }else{
                linhaResultado.innerHTML = `<td colspan="2"><p class="msgSucesso">${result.documento}</p></td>
                <td colspan="2"><a href="/pesquisa/files/${result.diretorio}/${result.cpf}/${result.orgao}">Download</a></td> `
            }
            
        }else{
            linhaResultado.innerHTML = `<td colspan="2"><p class="msgErro">Não foi possível processar o pedido para ${org[1].toUpperCase()}, verifique os dados e tente novamente em alguns instantes.</p></td>
            <td colspan="2"><a class="linkManual" href="${sitio}">Link da Busca</a></td>`
            linkEmNovaAba();
        }
    }else{
        linhaResultado.innerHTML = `<td colspan="2"><p class="msgErro">${result.erroValid}</p></td>
        <td colspan="2"><p class="msgErro">ATENÇÃO!</p></td>`
    }
}


let botoesOrgao = document.getElementsByClassName('btOrgao');
for (const btao of botoesOrgao) {
    btao.addEventListener('click', async (event)=>{
        event.preventDefault();
        let rota = btao.getAttribute('rota');
        let link = btao.getAttribute('link');
        let opcaoPesq = btao.getAttribute('opcoes');

        const linhaResultado = document.getElementById(opcaoPesq);
        linhaResultado.innerHTML = `<td colspan="4"><div id="prog" class="progress">
        <div class="progress-bar progress-bar-striped progress-bar-animated" aria-label="Example with label" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width: 100%">Processando... Pode levar alguns minutos, Aguarde!</div>   </div></td> `

        let opcoesPesq = document.getElementsByClassName(opcaoPesq);
        let linkOrgao = document.getElementById(link);
        let docs = [];
        for (const op of opcoesPesq) {
            if(op.getAttribute('select') == '1'){
                docs.push(op.getAttribute('value'))
            }
        }
        
        let nome = document.getElementById('pesquisaNome')
        let cpf = document.getElementById('pesquisaCpf')
        let token = document.getElementById('token')

        let objeto = {
            "_csrf": token.value,
            "nome": nome.value,
            "cpf": cpf.value,
            "documento": docs
        }            
        let body = JSON.stringify(objeto);       
        
          try {            
            
            let result = await fetch(rota, {
                method: 'post',
                body: body,
                credentials: 'include',
                headers: new Headers({ 
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',                   
                    'XSRF-TOKEN': token.value
                  })
            })
            let pResult = await result.json();
            carregaResult(pResult, opcaoPesq, linkOrgao.value);            

          } catch(e) {
            console.log(e);
          }           

    })
}



