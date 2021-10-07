const Web3 = require('web3');
const contract_udicoin = require('./build/Udicoin.json');

let web3;
let Udicoin;

window.consultarSaldo = async (numeroCuenta) => {
    const accounts = await web3.eth.getAccounts();
    const saldo = await Udicoin.methods.getSaldo(numeroCuenta).call({from: accounts[0]});
    return saldo;
};

window.enviar = async () => {
    const accounts = await web3.eth.getAccounts();
    var us = sessionStorage.getItem('usuario');
    var dest = document.getElementById('dest').value;
    var mont = document.getElementById('mont').value;
    console.log('us: '+us+' dest: '+dest+' mont:'+mont);
    const envio = await Udicoin.methods.enviar(us, dest, mont).send({from: accounts[0]});
    if (!envio) {
        alert("No tienes fondos suficientes");
    }
};

window.depositar = async (numeroCuenta) => {
    const accounts = await web3.eth.getAccounts();
    await Udicoin.methods.depositar(numeroCuenta, 500).send({from: accounts[0]});
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
    if (autenticar()){

    }
};

window.autenticar = async () => {
    const accounts = await web3.eth.getAccounts();
    var usuario = sessionStorage.getItem('usuario');
    var contra = sessionStorage.getItem('contra');
    console.log('us:'+usuario+' cont:'+contra);
    if (!await Udicoin.methods.autenticar(sessionStorage.getItem('usuario'), sessionStorage.getItem('contra')).call({from: accounts[0]})) {
        console.log('incorrecto')
        document.getElementById('contenido').innerHTML = `<h1>Contraseña Incorrecta</h1>`;
        return false;
    } else {
        console.log('correcto');
        document.getElementById('contenido').innerHTML = `
        <div class="container p-3 border rounded-3">
            <h3 class="text-primary">Bienvenido a Udico `+usuario+`</h3>
            <h1 class="my-5"><i class="bi bi-cash-coin"></i>Saldo: $`+(await consultarSaldo(usuario))+` UDC</h1>
            <div class="btn-group">
                <button type="button" class="btn btn-outline-success" data-bs-toggle="modal" data-bs-target="#transferModal">
                    <i class="bi bi-arrow-left-right"></i>
                    Transferir
                </button>
                <button type="button" class="btn btn-outline-success">
                    <i class="bi bi-wallet2"></i>
                    Pagar
                </button>
                <button type="button" class="btn btn-outline-success">
                    <i class="bi bi-arrow-right-square"></i>
                    Prestar
                </button>
            </div>
            <button type="button" class="btn btn-outline-primary">
                <i class="bi bi-arrow-left-square"></i>
                Solicitar Prestamo
            </button>
        </div>

        <!-- Modal -->
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
                <button type="button" class="btn btn-primary" onclick="enviar()">Enviar</button>
            </div>
            </div>
        </div>
        </div>

        <button class="btn btn-primary m-5" onclick="depositar('`+usuario+`')">Depositar</button>
        `;
        return true;
    }
    
}
  