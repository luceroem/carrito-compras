import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Venta, DetalleVenta } from './models/venta.model';
import { Producto } from '../productos/models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventas: Venta[] = [
    {
      idVenta: 1,
      fecha: new Date(),
      idCliente: 1,
      total: 150.00,
      detalles: [
        {
          idVenta: 1,
          idDetalleVenta: 1,
          idProducto: 1,
          cantidad: 2,
          precio: 75.00
        }
      ]
    },
    {
      idVenta: 2,
      fecha: new Date(),
      idCliente: 2,
      total: 200.00,
      detalles: [
        {
          idVenta: 2,
          idDetalleVenta: 1,
          idProducto: 2,
          cantidad: 1,
          precio: 200.00
        }
      ]
    }
  ];
  private carrito: DetalleVenta[] = []; // Agregar esta línea

  // Obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return of(this.ventas);
  }

  // Finalizar venta (crear o actualizar)
  finalizarVenta(venta: Venta): Observable<Venta> {
    if (venta.idVenta === 0) {
      // Crear nueva venta
      venta.idVenta = this.ventas.length + 1;
      this.ventas.push(venta);
    } else {
      // Actualizar venta existente
      const index = this.ventas.findIndex(v => v.idVenta === venta.idVenta);
      if (index !== -1) {
        this.ventas[index] = venta;
      }
    }
    return of(venta);
  }

  // Eliminar venta
  eliminarVenta(idVenta: number): Observable<void> {
    const index = this.ventas.findIndex(v => v.idVenta === idVenta);
    if (index !== -1) {
      this.ventas.splice(index, 1);
    }
    return of();
  }

  // Métodos para el carrito
  agregarAlCarrito(producto: Producto, cantidad: number): void {
    const detalleExistente = this.carrito.find(item => item.idProducto === producto.idProducto);
    
    if (detalleExistente) {
      detalleExistente.cantidad += cantidad;
    } else {
      const detalle: DetalleVenta = {
        idVenta: 0,
        idDetalleVenta: this.carrito.length + 1,
        idProducto: producto.idProducto,
        cantidad: cantidad,
        precio: producto.precioVenta // Usar precioVenta en lugar de precio
      };
      this.carrito.push(detalle);
    }
  }

  // Eliminar del carrito
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
    return this.carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }
}
