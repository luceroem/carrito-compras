import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarComponent } from './listar/listar.component';
import { CrearEditarComponent } from './crear-editar/crear-editar.component';

const routes: Routes = [
  { path: '', redirectTo: 'listar', pathMatch: 'full' }, // Redirige /categorias a /categorias/listar
  { path: 'listar', component: ListarComponent },
  { path: 'crear', component: CrearEditarComponent },
  { path: 'editar/:id', component: CrearEditarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriasRoutingModule {}
