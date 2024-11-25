// cliente.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from './models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [
    { idCliente: 1, nombre: 'Juan', apellido: 'Pérez', cedula: '12345678' },
    { idCliente: 2, nombre: 'Ana', apellido: 'González', cedula: '87654321' },
  ];

  getClientes(): Observable<Cliente[]> {
    return of(this.clientes); // Devuelve todos los clientes
  }

  buscarPorCedula(cedula: string): Observable<Cliente | null> {
    const cliente = this.clientes.find(c => c.cedula === cedula);
    return of(cliente || null); // Devuelve null si no encuentra al cliente
  }

  registrarCliente(cliente: Cliente): Observable<Cliente> {
    cliente.idCliente = this.clientes.length + 1;
    this.clientes.push(cliente);
    return of(cliente);
  }

  getClienteById(idCliente: number): Observable<Cliente | null> {
    const cliente = this.clientes.find(c => c.idCliente === idCliente);
    return of(cliente || null); // Devuelve null si no encuentra al cliente
  }
}
