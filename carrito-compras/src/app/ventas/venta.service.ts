import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Venta, DetalleVenta } from './models/venta.model';
import { Producto } from '../productos/models/producto.model';
import { Cliente } from '../clientes/models/cliente.model';
import { ClienteService } from '../clientes/cliente.service'; 
import { ProductoService } from '../productos/producto.service';  // Inyecta ProductoService
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventas: Venta[] = [];
  private carrito: DetalleVenta[] = [];
  private clientes: Cliente[] = [];

  constructor(private clienteService: ClienteService, private productoService: ProductoService) {
    this.cargarClientes();
  }

  // Método para cargar los clientes desde el servicio ClienteService
  cargarClientes(): void {
    this.clienteService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
    });
  }

  getVentas(): Observable<Venta[]> {
    return of(this.ventas);
  }

  finalizarVenta(venta: Venta): Observable<Venta> {
    if (venta.idVenta === 0) {
      venta.idVenta = this.ventas.length + 1;
      this.ventas.push(venta);
    } else {
      const index = this.ventas.findIndex(v => v.idVenta === venta.idVenta);
      if (index !== -1) {
        this.ventas[index] = venta;
      }
    }
    return of(venta);
  }

  eliminarVenta(idVenta: number): Observable<void> {
    const index = this.ventas.findIndex(v => v.idVenta === idVenta);
    if (index !== -1) {
      this.ventas.splice(index, 1);
    }
    return of();
  }

  agregarAlCarrito(producto: Producto, cantidad: number): void {
    const detalleExistente = this.carrito.find(item => item.idProducto === producto.idProducto);
    if (detalleExistente) {
      detalleExistente.cantidad += cantidad;
    } else {
      this.carrito.push({
        idVenta: 0,
        idDetalleVenta: this.carrito.length + 1,
        idProducto: producto.idProducto,
        cantidad: cantidad,
        precioVenta: producto.precioVenta
      });
    }
  }

  eliminarDelCarrito(idProducto: number): void {
    const index = this.carrito.findIndex(item => item.idProducto === idProducto);
    if (index !== -1) {
      this.carrito.splice(index, 1);
    }
  }

  getCarrito(): DetalleVenta[] {
    return this.carrito;
  }

  limpiarCarrito(): void {
    this.carrito = [];
  }

  calcularTotal(): number {
    return this.carrito.reduce((total, item) => total + item.precioVenta * item.cantidad, 0);
  }

  // Método para obtener un cliente por idCliente
  getCliente(idCliente: number): Cliente | undefined {
    return this.clientes.find(cliente => cliente.idCliente === idCliente);
  }

  // Servicio VentaService
    getClientes(): Cliente[] {
        return this.clientes; // Devuelve todos los clientes
    }

    // Método para obtener un producto por idProducto
    getProducto(idProducto: number): Observable<Producto | undefined> {
        return this.productoService.obtenerProductos().pipe(
            map(productos => productos.find(producto => producto.idProducto === idProducto))
        );
    }
      
  
}
