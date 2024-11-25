import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarProductosComponent } from './listar/listar.component';
import { CrearEditarProductoComponent } from './crear-editar/crear-editar.component';

const routes: Routes = [
  { path: '', redirectTo: 'listar', pathMatch: 'full' }, // Redirige /productos a /productos/listar
  { path: 'listar', component: ListarProductosComponent },
  { path: 'crear', component: CrearEditarProductoComponent },
  { path: 'editar/:id', component: CrearEditarProductoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductosRoutingModule { }
