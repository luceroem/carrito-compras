import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListarVentasComponent } from './listar/listar.component';
import { CrearEditarVentaComponent } from './crear-editar/crear-editar.component';

const routes: Routes = [
  { path: '', component: ListarVentasComponent }, // Página principal de "ventas"
  { path: 'crear', component: CrearEditarVentaComponent },
  { path: 'editar/:id', component: CrearEditarVentaComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VentasRoutingModule {}
