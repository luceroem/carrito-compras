import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule]
})
export class AppComponent {
  title = 'Carrito de Compras';
  
  menuItems = [
    { path: '/ventas', label: 'Ventas' },
    { path: '/categorias', label: 'Categorías' },
    { path: '/productos', label: 'Productos' },
    { path: '/clientes', label: 'Clientes' }
  ];
}
