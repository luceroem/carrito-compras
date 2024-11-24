import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../producto.service';
import { CategoriaService } from '../../categorias/categoria.service';
import { Producto } from '../models/producto.model';
import { Categoria } from '../../categorias/models/categoria.model';


@Component({
  selector: 'app-listar-productos',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css'],
})
export class ListarProductosComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  filtroNombre: string = '';
  filtroCategoria: number | null = null;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  // Método para cargar los productos
  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data: Producto[]) => {
        this.productos = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar productos:', error);
      },
    });
  }

  // Método para cargar las categorías
  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (data: Categoria[]) => {
        this.categorias = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar categorías:', error);
      },
    });
  }

  // Método para filtrar productos según nombre y categoría
  filtrarProductos(): Producto[] {
    return this.productos.filter((producto) => {
      const coincideNombre = producto.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideCategoria = this.filtroCategoria
        ? producto.idCategoria === this.filtroCategoria
        : true;
      return coincideNombre && coincideCategoria;
    });
  }

  // Método para obtener el nombre de la categoría basado en el ID
  obtenerCategoriaNombre(idCategoria: number): string {
    const categoria = this.categorias.find(c => c.idCategoria === idCategoria);
    return categoria ? categoria.nombre : 'Categoría no encontrada';
  }

  // Método para eliminar un producto
  eliminarProducto(id: number): void {
    if (confirm('¿Desea eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.cargarProductos();  // Recargar productos después de eliminar
        },
        error: (error: Error) => {
          console.error('Error al eliminar producto:', error);
        },
      });
    }
  }
}
