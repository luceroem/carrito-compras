import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from './models/producto.model';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private productos: Producto[] = [];

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  // Crear un nuevo producto
  crearProducto(producto: Producto): Observable<Producto> {
    const nuevoId = this.productos.length > 0 
      ? Math.max(...this.productos.map(p => p.idProducto!)) + 1 
      : 1;
    const nuevoProducto = {
      ...producto,
      idProducto: nuevoId
    };
    this.productos.push(nuevoProducto);
    return of(nuevoProducto);
  }

  // Obtener un producto por ID
  obtenerProductoPorId(id: number): Observable<Producto | null> {
    const producto = this.productos.find(p => p.idProducto === id);
    return of(producto || null);
  }

  // Editar un producto
  editarProducto(producto: Producto): Observable<Producto> {
    const index = this.productos.findIndex(p => p.idProducto === producto.idProducto);
    if (index !== -1) {
      this.productos[index] = {...producto};
      return of(this.productos[index]);
    }
    throw new Error('Producto no encontrado');
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<void> {
    const index = this.productos.findIndex(p => p.idProducto === id);
    if (index !== -1) {
      this.productos.splice(index, 1);
    }
    return of(void 0);
  }
}
