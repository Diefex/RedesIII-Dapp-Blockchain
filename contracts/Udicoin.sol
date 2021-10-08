// SPDX-License-Identifier: None
pragma solidity >=0.4.22 <0.9.0;

contract Udicoin {
  struct Cuenta {
    string contra;
    uint saldo;
    uint matricula;
    uint numTx;
    mapping(uint => string) tranx;
  }
  mapping(string => Cuenta) cuentas;

  constructor() {
    cuentas['Diego'].contra = '1234';
    cuentas['Diego'].saldo = 500000;
    cuentas['Diego'].matricula = 200000;

    cuentas['Juan'].contra = '4321';
    cuentas['Juan'].saldo = 50000;
    cuentas['Juan'].matricula = 50000;

    cuentas['Daniel'].contra = '55555';
    cuentas['Daniel'].saldo = 10;
    cuentas['Daniel'].matricula = 10000000;

    cuentas['Universidad'].contra = 'uni';
    cuentas['Universidad'].saldo = 1000000;
  }

  function enviar(string memory origen, string memory destino, uint cantidad, string memory tranxOr, string memory tranxDes) public returns (bool) {
    if (cuentas[origen].saldo >= cantidad){
      cuentas[origen].saldo -= cantidad;
      cuentas[destino].saldo += cantidad;
      cuentas[origen].numTx += 1;
      cuentas[origen].tranx[cuentas[origen].numTx] = tranxOr;
      cuentas[destino].numTx += 1;
      cuentas[destino].tranx[cuentas[destino].numTx] = tranxDes;
      return true;
    } else {
      return false;
    }
  }

  function depositar(string memory cuenta, uint cantidad) public returns (bool) {
    cuentas[cuenta].saldo += cantidad;
    return true;
  }

  function getSaldo(string memory cuenta) public view returns (uint){
    return cuentas[cuenta].saldo;
  }

  function getMatricula(string memory cuenta) public view returns (uint){
    return cuentas[cuenta].matricula;
  }

  function getTranx(string memory cuenta) public view returns (string[] memory){
    uint nTx = cuentas[cuenta].numTx;
    string[] memory trx = new string[](nTx+1);
    for(uint i=1; i<=nTx; i++){
      trx[i] = cuentas[cuenta].tranx[i];
    }
    return trx;
  }

  function autenticar(string memory usuario, string memory contra) public view returns (bool){
    if(keccak256(bytes(cuentas[usuario].contra)) == keccak256(bytes(contra)) && keccak256(bytes(contra)) != keccak256(bytes(''))){
      return true;
    } else {
      return false;
    }
  }
}

