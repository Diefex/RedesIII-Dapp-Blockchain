const Web3 = require('web3');
const contract_udicoin = require('./build/Udicoin.json');

let web3;
let Udicoin;

window.consultarSaldo = async (usuario) => {
    const accounts = await web3.eth.getAccounts();
    const saldo = await Udicoin.methods.getSaldo(usuario).call({from: accounts[0]});
    return saldo;
};

window.enviar = async () => {
    var dest = document.getElementById('dest').value;
    var mont = document.getElementById('mont').value;
    var us = sessionStorage.getItem('usuario');
    if(await transferir(dest, mont, 'Enviados $'+mont+' UDC a '+dest, 'recibidos $'+mont+' UDC de '+us)){}
};

window.pagarDP = async () => {
    const accounts = await web3.eth.getAccounts();
    var us = sessionStorage.getItem('usuario');
    for (var i = 0; i < document.DPs.radioDP.length; i++){ 
      	if (document.DPs.radioDP[i].checked) {
            var mont = document.DPs.radioDP[i].value 
         	break; 
 		}
   	}
    if(await transferir('Universidad', mont, 'Pagados $'+mont+' UDC por Derechos Pecunarios', 'Pago de Derechos Pecunarios de '+us+' por valor de $'+mont+' UDC')){}
}

window.pagarMT = async () => {
    const accounts = await web3.eth.getAccounts();
    var us = sessionStorage.getItem('usuario');
    const mont = await Udicoin.methods.getMatricula(us).call({from: accounts[0]});
    if(await transferir('Universidad', mont, 'Pago de matricula por $'+mont+' UDC', 'Pago de Matricula de '+us+' por valor de $'+mont+' UDC')){}
}

window.transferir = async (dest, mont, txOr, txDs) => {
    const accounts = await web3.eth.getAccounts();
    var us = sessionStorage.getItem('usuario');
    var saldo = await consultarSaldo(us);
    var alerta = document.createElement('div');

    if (parseInt(saldo) < parseInt(mont)){
        alerta.innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">No tienes suficiente saldo!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        document.getElementById('alertas').append(alerta);
        return false;
    }
    alerta.innerHTML = '<div class="alert alert-primary alert-dismissible" role="alert"><div class="spinner-border text-primary" role="status"></div>Procesando transferencia<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    document.getElementById('alertas').append(alerta);
    try{
        if(await Udicoin.methods.enviar(us, dest, mont, txOr, txDs).send({from: accounts[0]})){
            document.getElementById('saldo').innerHTML = await consultarSaldo(us);
            var transacciones = await Udicoin.methods.getTranx(us).call({from: accounts[0]});
            document.getElementById('transacciones').innerHTML = '';
            for(var i=0; i<transacciones.length; i++){
                tr = document.createElement('tr');
                tr.innerHTML = '<td>'+transacciones[i]+'</td>';
                document.getElementById('transacciones').append(tr);
            }
            alerta.innerHTML = '<div class="alert alert-success alert-dismissible" role="alert">Transferencia Realizada!<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            document.getElementById('alertas').append(alerta);
            return true;
        } else {
            alerta.innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">No hay saldo suficiente<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
            document.getElementById('alertas').append(alerta);
            return false;
        }
    } catch (error){
        console.log(error);
        alerta.innerHTML = '<div class="alert alert-success alert-danger" role="alert">La transaccion no fue completada<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
        document.getElementById('alertas').append(alerta);
        return false;
    }
}

window.depositar = async (usuario) => {
    const accounts = await web3.eth.getAccounts();
    await Udicoin.methods.depositar(usuario, 500).send({from: accounts[0]});
    document.getElementById('saldo').innerHTML = await consultarSaldo(us);
};

const connectWeb3 = async () => {
    let provider;
    if(window.ethereum){
      provider = window.ethereum;
      await window.ethereum.enable();
    } else if(window.web3) {
      provider = window.web3.givenProvider;
    } else {
      alert('El navegador no se puede conectar a una red Ethereum. Verifique que tenga instalado Metamask o algun sofware similar');
    }
    web3 = new Web3(provider);
};

window.onload = async () => {
    await connectWeb3();
    Udicoin = new web3.eth.Contract(
        contract_udicoin.abi,
        contract_udicoin.networks[5777].address
    );
    if (await autenticar()){
        var usuario = sessionStorage.getItem('usuario');
        const accounts = await web3.eth.getAccounts();
        var matricula = await Udicoin.methods.getMatricula(usuario).call({from: accounts[0]});
        var transacciones = await Udicoin.methods.getTranx(usuario).call({from: accounts[0]});
        console.log(usuario=='Universidad');
        document.getElementById('contenido').innerHTML = `
        <div class="container p-3 border rounded-3">
            <h3 class="text-primary">Bienvenido a Udico `+usuario+`</h3>
            <h1 class="my-5"><i class="bi bi-cash-coin"></i>Saldo: $<span id=saldo>`+(await consultarSaldo(usuario))+`</span> UDC</h1>
            <div class="btn-group lg">
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#transferModal">
                    <i class="bi bi-arrow-left-right"></i>
                    Enviar Saldo
                </button>
                `+( (usuario=='Universidad')?``:`
                <button type="button" class="btn btn-outline-success"  data-bs-toggle="modal" data-bs-target="#payModal">
                    <i class="bi bi-wallet2"></i>
                    Pagar Derechos Pecunarios
                </button>
                <button type="button" class="btn btn-outline-success"  data-bs-toggle="modal" data-bs-target="#matModal">
                    <i class="bi bi-journal-bookmark"></i>
                    Pagar Matricula
                </button>`)+`
            </div>
        </div>

        <div class="modal fade" id="transferModal" tabindex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transferModalLabel">Modal title</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="form-group">
                                <label for="dest" class="col-form-label">Destinatario:</label>
                                <input type="text" class="form-control" id="dest">
                            </div>
                            <div class="form-group">
                                <label for="mont" class="col-form-label">Monto:</label>
                                <input type="number" class="form-control" id="mont">
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="enviar()">Enviar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="payModal" tabindex="-1" aria-labelledby="payModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="payModalLabel">Pago derechos pecuniarios</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form name=DPs>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioDP" id="radioDP1" value=15100>
                                <label class="form-check-label" for="radioDP1">
                                    Pagar certificado de notas $15.100
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioDP" id="radioDP2" value=7600>
                                <label class="form-check-label" for="radioDP2">
                                    Pagar constancia de estudio $7.600
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioDP" id="radioDP3" value=30300>
                                <label class="form-check-label" for="radioDP3">
                                    Duplicado de carné $30.300
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioDP" id="radioDP4" value=90900>
                                <label class="form-check-label" for="radioDP4">
                                    Cursos vacacionales $90.900
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" name="radioDP" id="radioDP5" value=3000>
                                <label class="form-check-label" for="radioDP5">
                                    Multa de biblioteca $3.000
                                </label>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="pagarDP()">Enviar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="matModal" tabindex="-1" aria-labelledby="transferModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="transferModalLabel">Pagar Matricula</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <h4>El valor de su matricula es de:</h4>
                        <p><h2>$`+matricula+` UDC</h2></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="pagarMT()">Pagar</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="alertas"></div>
        <div class="container">
            <table class="table table-striped table-hover">
                <thead><tr class="table-dark"><th>Transacciones</th></tr></thead>
                <tbody id="transacciones"></tbody>
            </table>
        </div>
        `;

        tranx = '';
        for(var i=0; i<transacciones.length; i++){
            tranx += '<tr><td>'+transacciones[i]+'</td></tr>';
        }
        document.getElementById('transacciones').innerHTML = tranx;
    }
};

window.autenticar = async () => {
    const accounts = await web3.eth.getAccounts();
    var usuario = sessionStorage.getItem('usuario');
    var contra = sessionStorage.getItem('contra');
    if (!await Udicoin.methods.autenticar(usuario, contra).call({from: accounts[0]})) {
        document.getElementById('contenido').innerHTML = `<h1>Contraseña Incorrecta <a href="index.html">Volver</a></h1>`;
        return false;
    } else {
        return true;
    }
    
}