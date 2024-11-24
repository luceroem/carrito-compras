import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from '../venta.service';
import { Venta } from '../models/venta.model';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarVentasComponent implements OnInit {
  ventas: Venta[] = [];

  constructor(
    private router: Router,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarVentas();
  }

  // Cargar todas las ventas
  cargarVentas(): void {
    this.ventaService.getVentas().subscribe(ventas => {
      this.ventas = ventas;
    });
  }

  // Método para crear una nueva venta
  crearNuevaVenta(): void {
    this.router.navigate(['/ventas/crear']);
  }

  // Método para editar una venta
  editarVenta(venta: Venta): void {
    this.router.navigate(['/ventas/editar', venta.idVenta]);
    console.log('Editar venta:', venta);
  }

  // Método para eliminar una venta
  eliminarVenta(idVenta: number): void {
    // Confirma antes de eliminar
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta venta?');
    if (confirmDelete) {
      this.ventaService.eliminarVenta(idVenta).subscribe(() => {
        // Actualizar la lista de ventas después de eliminar
        this.cargarVentas();
        alert('Venta eliminada con éxito.');
      });
    }
  }
}
