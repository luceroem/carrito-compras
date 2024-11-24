import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'ventas', pathMatch: 'full' },
  { path: 'categorias', loadChildren: () => import('./categorias/categoria.module').then(m => m.CategoriasModule)},
  { path: 'productos', loadChildren: () => import('./productos/productos.module').then(m => m.ProductosModule)},
  { path: 'ventas', loadChildren: () => import('./ventas/ventas.module').then(m => m.VentasModule)},
  { path: '**', redirectTo: 'ventas' } // Redirect to ventas if the path is not found 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
