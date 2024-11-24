import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { ListarComponent } from './listar/listar.component';
import { CrearEditarComponent } from './crear-editar/crear-editar.component';

@NgModule({
  declarations: [ListarComponent, CrearEditarComponent],
  imports: [CommonModule, FormsModule, CategoriasRoutingModule],
})
export class CategoriasModule {}
