// cliente.service.ts
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Cliente } from './models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientes: Cliente[] = [];

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
