import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'categorias',
    loadChildren: () =>
      import('./categorias/categoria.module').then((m) => m.CategoriasModule),
  },
  {
    path: 'productos',
    loadChildren: () =>
      import('./productos/productos.module').then((m) => m.ProductosModule),
  },
  {
    path: 'ventas',
    loadChildren: () =>
      import('./ventas/ventas.module').then((m) => m.VentasModule),
  }
];

