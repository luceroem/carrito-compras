import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from '../venta.service';
import { Venta } from '../models/venta.model';
import { Cliente } from '../../clientes/models/cliente.model';
import { DetalleVenta } from '../models/venta.model';

@Component({
  selector: 'app-listar-ventas',
  templateUrl: './listar.component.html',
  styleUrls: ['./listar.component.css']
})
export class ListarVentasComponent implements OnInit {
  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = []; // Array para mostrar las ventas filtradas
  clientes: Cliente[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  clienteCedula: string = '';
  clienteNombre: string = '';
  clienteApellido: string = '';
  detallesVenta: DetalleVenta[] = [];
  mostrarModal: boolean = false;
  mostrarModalFiltros: boolean = false;
  idProducto: number = 0;
  nombreProducto: string = '';

  constructor(
    private router: Router,
    private ventaService: VentaService
  ) {}

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarVentas();
  }

  // Cargar todas las ventas
  cargarVentas(): void {
    this.ventaService.getVentas().subscribe(ventas => {
      this.ventas = ventas.map(venta => {
        const cliente = this.ventaService.getCliente(venta.idCliente);   // Buscar cliente en la lista cargada
        return { ...venta, cliente };  // Agregar cliente directamente a la venta
      });
      this.filtrarVentas(); // Filtrar las ventas después de cargarlas
    });
  }
  

  abrirModal(venta: Venta): void {
    if (venta && venta.detalles) {
      this.detallesVenta = venta.detalles.map(detalle => {
        // Obtener el nombre del producto y añadirlo a cada detalle
        this.ventaService.getProducto(detalle.idProducto).subscribe(producto => {
          detalle.nombreProducto = producto ? producto.nombre : 'Producto no encontrado';
        });
        return detalle;
      });
      this.mostrarModal = true; // Mostrar el modal
    } else {
      console.error('Venta inválida o sin detalles', venta);
    }
  }
        
    cerrarModal(): void {
        this.mostrarModal = false;
        this.detallesVenta = [];
    }

    // Método para obtener el nombre del cliente basado en el ID
   // Método para obtener el nombre y apellido del cliente basado en el ID
    obtenerNombreCliente(idCliente: number): string {
        const cliente = this.ventaService.getCliente(idCliente);
        return cliente ? `${cliente.nombre} ${cliente.apellido}` : 'Cliente no encontrado';
    }
  
    // Método para obtener el nombre del producto basado en el ID
    obtenerNombreProducto(idProducto: number): void {
    this.ventaService.getProducto(idProducto).subscribe(producto => {
        console.log(producto); // Para verificar que el producto es correcto
        this.nombreProducto = producto ? producto.nombre : 'Producto no encontrado';
    });
    }

 
  // Cargar todos los clientes
  cargarClientes(): void {
    this.clientes = this.ventaService.getClientes(); // Accede a la lista de clientes en el servicio
  }

  // Filtrar las ventas en base a los criterios de búsqueda
  filtrarVentas(): void {
    this.ventasFiltradas = this.ventas.filter(venta => {
      const fechaValida = this.filtrarPorFecha(venta);
      const clienteValido = this.filtrarPorCliente(venta);
      return fechaValida && clienteValido;
    });
  }

  // Filtrar por rango de fechas
  filtrarPorFecha(venta: Venta): boolean {
    const fechaVenta = new Date(venta.fecha);
    const fechaInicioValida = this.fechaInicio ? new Date(this.fechaInicio) <= fechaVenta : true;
    const fechaFinValida = this.fechaFin ? new Date(this.fechaFin) >= fechaVenta : true;
    return fechaInicioValida && fechaFinValida;
  }

  // Filtrar por cliente (nombre o apellido)
  filtrarPorCliente(venta: Venta): boolean {
    const cliente = this.ventaService.getCliente(venta.idCliente);
    if (!cliente) return false;

    const nombreValido = this.clienteNombre ? cliente.nombre.toLowerCase().includes(this.clienteNombre.toLowerCase()) : true;
    const apellidoValido = this.clienteApellido ? cliente.apellido.toLowerCase().includes(this.clienteApellido.toLowerCase()) : true;
    const cedulaValida = this.clienteCedula ? cliente.cedula.includes(this.clienteCedula) : true;
    return nombreValido && apellidoValido && cedulaValida;
  }


  // Método para ir a la página de detalles de la venta (productos)
  verDetallesVenta(ventaId: number): void {
    this.router.navigate(['/ventas/detalles', ventaId]);
  }

  // Método para crear una nueva venta
  crearNuevaVenta(): void {
    this.router.navigate(['/ventas/crear']);
  }

  // Método para editar una venta
  editarVenta(venta: Venta): void {
    this.router.navigate(['/ventas/editar', venta.idVenta]);
  }

  // Método para eliminar una venta
  eliminarVenta(idVenta: number): void {
    const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta venta?');
    if (confirmDelete) {
      this.ventaService.eliminarVenta(idVenta);
      this.cargarVentas(); // Actualiza las ventas después de eliminar
      alert('Venta eliminada con éxito.');
    }
  }
}
