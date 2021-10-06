// SPDX-License-Identifier: None
pragma solidity >=0.4.22 <0.9.0;

contract Udicoin {
	struct Cuenta {
    string nombre;
    uint saldo;
  }
  mapping(uint => Cuenta) cuentas;

  constructor() {}

  function enviar(uint origen, uint destino, uint cantidad) public returns (bool) {
    if (cuentas[origen].saldo >= cantidad){
      cuentas[origen].saldo -= cantidad;
      cuentas[destino].saldo += cantidad;
      return true;
    } else {
      return false;
    }
  }

  function depositar(uint numeroCuenta, uint cantidad) public returns (bool) {
    cuentas[numeroCuenta].saldo += cantidad;
    return true;
  }

  function getSaldo(uint numeroCuenta) public view returns (uint){
    return cuentas[numeroCuenta].saldo;
  }
}

