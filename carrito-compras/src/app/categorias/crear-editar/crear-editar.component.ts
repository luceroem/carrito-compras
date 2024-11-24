import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriaService } from '../categoria.service';
import { Categoria } from '../models/categoria.model';

@Component({
  selector: 'app-crear-editar',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.css'],
})
export class CrearEditarComponent implements OnInit {
  categoria: Categoria = { idCategoria: 0, nombre: '' };
  esEdicion: boolean = false;

  constructor(
    private categoriaService: CategoriaService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.esEdicion = true;
      this.categoriaService.obtenerCategoriaPorId(+id).subscribe({
        next: (categoria: Categoria | null) => {
          if (categoria) {
            this.categoria = categoria;
          }
        },
        error: (error) => {
          console.error('Error al obtener la categoría:', error);
        }
      });
    }
  }

  guardarCategoria(): void {
    if (this.esEdicion) {
      this.categoriaService.editarCategoria(this.categoria);
    } else {
      this.categoriaService.crearCategoria(this.categoria);
    }
    this.router.navigate(['/categorias']);
  }
}
