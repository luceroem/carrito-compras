import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Categoria } from './models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categorias: Categoria[] = [];

  constructor() { }

  obtenerCategoriaPorId(id: number): Observable<Categoria | null> {
    const categoria = this.categorias.find(c => c.idCategoria === id);
    return of(categoria || null);
  }

  crearCategoria(categoria: Categoria): void {
    const nuevoId = this.categorias.length > 0 
      ? Math.max(...this.categorias.map(c => c.idCategoria)) + 1 
      : 1;
    categoria.idCategoria = nuevoId;
    this.categorias.push({...categoria});
  }

  editarCategoria(categoria: Categoria): void {
    const index = this.categorias.findIndex(c => c.idCategoria === categoria.idCategoria);
    if (index !== -1) {
      this.categorias[index] = {...categoria};
    }
  }

  obtenerCategorias(): Observable<Categoria[]> {
    return of(this.categorias);
  }

  eliminarCategoria(id: number): void {
    const index = this.categorias.findIndex(c => c.idCategoria === id);
    if (index !== -1) {
      this.categorias.splice(index, 1);
    }
  }
}
