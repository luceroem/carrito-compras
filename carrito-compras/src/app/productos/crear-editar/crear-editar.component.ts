import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductoService } from '../producto.service';
import { Producto } from '../models/producto.model';
import { CategoriaService } from '../../categorias/categoria.service';
import { Categoria } from '../../categorias/models/categoria.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-crear-editar-producto',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.css'],
})
export class CrearEditarProductoComponent implements OnInit {
  producto: Producto = { idProducto: 0, nombre: '', idCategoria: 0, precioVenta: 0 };
  categorias: Categoria[] = [];
  esEdicion: boolean = false;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener lista de categorías para el selector
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => (this.categorias = categorias),
      error: (error) => console.error('Error al cargar las categorías:', error),
    });

    // Verificar si es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.productoService.obtenerProductoPorId(+id).subscribe({
        next: (producto) => {
          if (producto) this.producto = producto;
        },
        error: (error) => console.error('Error al obtener el producto:', error),
      });
    }
  }

  guardarProducto(): void {
    if (this.esEdicion) {
      this.productoService.editarProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/productos']),
        error: (error) => console.error('Error al editar el producto:', error),
      });
    } else {
      this.productoService.crearProducto(this.producto).subscribe({
        next: () => this.router.navigate(['/productos']),
        error: (error) => console.error('Error al crear el producto:', error),
      });
    }
  }
}
