// SPDX-License-Identifier: None
pragma solidity >=0.4.22 <0.9.0;

contract Udicoin {
	struct Cuenta {
    string contra;
    uint saldo;
  }
  mapping(string => Cuenta) cuentas;

  constructor() {
    cuentas['Diego'].contra = '1234';
    cuentas['Diego'].saldo = 5000;

    cuentas['Juan'].contra = '4321';
    cuentas['Juan'].saldo = 5000;

    cuentas['Daniel'].contra = '55555';
    cuentas['Daniel'].saldo = 10;

    cuentas['Universidad'].contra = 'uni';
    cuentas['Universidad'].saldo = 1000000;
  }

  function enviar(string memory origen, string memory destino, uint cantidad) public returns (bool) {
    if (cuentas[origen].saldo >= cantidad){
      cuentas[origen].saldo -= cantidad;
      cuentas[destino].saldo += cantidad;
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

  function autenticar(string memory usuario, string memory contra) public view returns (bool){
    if(keccak256(bytes(cuentas[usuario].contra)) == keccak256(bytes(contra)) && keccak256(bytes(contra)) != keccak256(bytes(''))){
      return true;
    } else {
      return false;
    }
  }
}

