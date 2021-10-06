const Web3 = require('web3');
const contract_udicoin = require('./build/Udicoin.json');

let web3;
let Udicoin;

window.consultarSaldo = async (numeroCuenta) => {
    const accounts = await web3.eth.getAccounts();
    const saldo = await Udicoin.methods.getSaldo(numeroCuenta).call({from: accounts[0]});
    return saldo;
};

window.enviar = async (origen, destino) => {
    const accounts = await web3.eth.getAccounts();
    const envio = await Udicoin.methods.enviar(origen, destino, 100).send({from: accounts[0]});
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
    document.getElementById('saldo1').innerHTML = '$'+(await consultarSaldo(1))+' UDC';
    document.getElementById('saldo2').innerHTML = '$'+(await consultarSaldo(2))+' UDC';
};
  