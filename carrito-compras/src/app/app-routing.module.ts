import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule) },
  { path: 'categorias', loadChildren: () => import('./categorias/categoria.module').then(m => m.CategoriasModule) },
  { path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule) },
  { path: '', redirectTo: 'ventas', pathMatch: 'full' }, // Redirección al final
  { path: '**', redirectTo: 'ventas' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
