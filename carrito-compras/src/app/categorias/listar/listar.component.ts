import { Component, OnInit } from '@angular/core';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-listar',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarComponent implements OnInit {
  categorias: Categoria[] = [];
  filtroNombre: string = '';

  constructor(private categoriaService: CategoriaService) {}

  ngOnInit(): void {
    this.cargarCategorias();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  filtrarCategorias(): Categoria[] {
    return this.categorias.filter((c) =>
      c.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
  }

  eliminarCategoria(id: number): void {
    if (confirm('¿Desea eliminar esta categoría?')) {
      this.categoriaService.eliminarCategoria(id);
      this.cargarCategorias();
    }
  }
}
