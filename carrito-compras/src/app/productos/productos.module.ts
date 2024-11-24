import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductosRoutingModule } from './productos-routing.module';
import { ListarProductosComponent } from './listar/listar.component';
import { CrearEditarProductoComponent } from './crear-editar/crear-editar.component';

@NgModule({
  declarations: [
    ListarProductosComponent,
    CrearEditarProductoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ProductosRoutingModule
  ]
})
export class ProductosModule { }
