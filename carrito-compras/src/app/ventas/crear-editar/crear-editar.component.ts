// crear-editar.component.ts
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { VentaService } from '../venta.service';
import { ProductoService } from '../../productos/producto.service';
import { ClienteService } from '../../clientes/cliente.service';
import { Venta, DetalleVenta } from '../models/venta.model';
import { Producto } from '../../productos/models/producto.model';
import { Cliente } from '../../clientes/models/cliente.model';
import { CategoriaService } from '../../categorias/categoria.service';
import { Categoria } from '../../categorias/models/categoria.model';

@Component({
  selector: 'app-crear-editar-venta',
  templateUrl: './crear-editar.component.html',
  styleUrls: ['./crear-editar.component.css']
})
export class CrearEditarVentaComponent implements OnInit {
  productos: Producto[] = [];
  busqueda: string = '';
  categoriaSeleccionada: number = 0;
  cantidad: number = 1;
  cliente: Cliente | null = null;
  cedula: string = '';
  nombre: string = '';
  apellido: string = '';
  isEdit: boolean = false;
  venta: Venta = {
    idVenta: 0,
    fecha: new Date(),
    idCliente: 0,
    total: 0,
    detalles: []
  };
  categorias: Categoria[] = [];
  productosEnCarrito: { producto: Producto, cantidad: number }[] = [];
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public ventaService: VentaService, // Change to public
    private clienteService: ClienteService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    const idVenta = this.route.snapshot.paramMap.get('id');
    if (idVenta) {
      this.isEdit = true;
      this.ventaService.getVentas().subscribe((ventas: Venta[]) => {
        const ventaEncontrada = ventas.find(v => v.idVenta === +idVenta);
        if (ventaEncontrada) {
          this.venta = ventaEncontrada;
          this.cargarDatosVenta(ventaEncontrada);
        } else {
          this.router.navigate(['/ventas']);
        }
      });
    }
    this.buscarProductos();
  }

  cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe((categorias: Categoria[]) => {
      this.categorias = categorias;
    });
  }

  buscarProductos(): void {
    this.productoService.obtenerProductos().subscribe((productos: Producto[]) => {
      this.productos = productos.filter(p => 
        p.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) &&
        (this.categoriaSeleccionada === 0 || p.idCategoria === this.categoriaSeleccionada)
      );
    });
  }

  agregarAlCarrito(producto: Producto): void {
    this.ventaService.agregarAlCarrito(producto, this.cantidad);
    this.cantidad = 1;
  }

  actualizarProductoCarrito(idProducto: number, nuevaCantidad: number): void {
    const detalle = this.ventaService.getCarrito().find(d => d.idProducto === idProducto);
    if (detalle) {
      detalle.cantidad = nuevaCantidad;
    }
  }

  eliminarDelCarrito(idProducto: number): void {
    this.ventaService.eliminarDelCarrito(idProducto);
  }

  buscarCliente(): void {
    if (!this.cedula.trim()) {
      this.mensajeError = 'Ingrese una cédula válida';
      return;
    }

    this.clienteService.buscarPorCedula(this.cedula).subscribe(
      (cliente: Cliente | null) => {
        if (cliente) {
          this.cliente = cliente;
          this.nombre = cliente.nombre;
          this.apellido = cliente.apellido;
          this.mensajeError = '';
        } else {
          this.mensajeError = 'Cliente no encontrado';
        }
      },
      error => {
        this.mensajeError = 'Error al buscar cliente';
      }
    );
  }

  registrarCliente(): void {
    if (!this.cedula.trim() || !this.nombre.trim() || !this.apellido.trim()) {
      this.mensajeError = 'Todos los campos son requeridos';
      return;
    }

    const nuevoCliente: Cliente = {
      idCliente: 0,
      cedula: this.cedula,
      nombre: this.nombre,
      apellido: this.apellido
    };

    this.clienteService.registrarCliente(nuevoCliente).subscribe(
      (cliente: Cliente) => {
        this.cliente = cliente;
        this.mensajeExito = 'Cliente registrado exitosamente';
        this.mensajeError = '';
      },
      error => {
        this.mensajeError = 'Error al registrar cliente';
      }
    );
  }

  guardarVenta(): void {
    if (!this.cliente) {
      this.mensajeError = 'Debe seleccionar un cliente';
      return;
    }

    if (this.ventaService.getCarrito().length === 0 && !this.isEdit) {
      this.mensajeError = 'El carrito está vacío';
      return;
    }

    this.venta.idCliente = this.cliente.idCliente;
    this.venta.total = this.ventaService.calcularTotal();
    
    if (!this.isEdit) {
      this.venta.detalles = this.ventaService.getCarrito();
    }

    this.ventaService.finalizarVenta(this.venta).subscribe(
      () => {
        this.ventaService.limpiarCarrito();
        this.mensajeExito = 'Venta guardada exitosamente';
        setTimeout(() => {
          this.router.navigate(['/ventas']);
        }, 1500);
      },
      error => {
        this.mensajeError = 'Error al guardar la venta';
      }
    );
  }

  private cargarDatosVenta(venta: Venta): void {
    this.clienteService.getClienteById(venta.idCliente).subscribe(
      (cliente: Cliente | null) => {
        if (cliente) {
          this.cliente = cliente;
          this.cedula = cliente.cedula;
          this.nombre = cliente.nombre;
          this.apellido = cliente.apellido;
        }
      }
    );

    this.productoService.obtenerProductos().subscribe((productos: Producto[]) => {
      this.productos = productos;
      this.ventaService.limpiarCarrito();
      venta.detalles.forEach(detalle => {
        const producto = productos.find(p => p.idProducto === detalle.idProducto);
        if (producto) {
          this.ventaService.agregarAlCarrito(producto, detalle.cantidad);
        }
      });
    });
  }

  // Add helper methods to access product information
  getProductoNombre(idProducto: number): string {
    const producto = this.productos.find(p => p.idProducto === idProducto);
    return producto ? producto.nombre : '';
  }

  getCarritoItems(): DetalleVenta[] {
    return this.ventaService.getCarrito();
  }
}
