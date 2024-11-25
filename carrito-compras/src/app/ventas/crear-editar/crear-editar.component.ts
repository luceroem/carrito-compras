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
    clienteRegistrado: Cliente | null = null;
    cedulaCliente: string = '';
    nombreCliente: string = '';
    apellidoCliente: string = '';
    isEdit: boolean = false;
    venta: Venta = { idVenta: 0, fecha: new Date(), idCliente: 0, total: 0, detalles: [] };
    categorias: Categoria[] = [];
    mensajeExito: string = ''; 
    mensajeError: string = '';
    mostrarModal: boolean = false;
    mostrarModalCliente: boolean = false;
    productoSeleccionado: Producto | null = null;
    filtroNombre: string = ''; // Para almacenar el texto de búsqueda
    filtroCategoria: number | null = null; // Para almacenar la categoría seleccionada
    

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        public ventaService: VentaService,
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
                p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase()) &&
                (this.filtroCategoria === null || p.idCategoria === this.filtroCategoria)
            );
        });
    }
    

    abrirModal(producto: Producto): void {
        this.productoSeleccionado = producto;
        this.cantidad = 1; // Valor por defecto
        this.mostrarModal = true;
    }

    cerrarModal(): void {
        this.productoSeleccionado = null;
        this.mostrarModal = false;
    }

    // Método para abrir el modal al hacer clic en "Finalizar Orden"
    abrirModalFinalizarOrden(): void {
        this.mostrarModalCliente = true; // Muestra el modal de cliente
    }

    // Método para cerrar el modal
    cerrarModalCliente(): void {
        this.mostrarModalCliente = false; // Cierra el modal de cliente
    }

    agregarDetalleVenta(): void {
        if (this.productoSeleccionado && this.cantidad > 0) {
        this.ventaService.agregarAlCarrito(this.productoSeleccionado, this.cantidad);
        this.cerrarModal(); // Cierra el modal tras agregar
        }
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
        if (!this.cedulaCliente.trim()) {
        this.mensajeError = 'Ingrese una cédula válida';
        return;
        }
    
        this.clienteService.buscarPorCedula(this.cedulaCliente).subscribe(
        (cliente: Cliente | null) => {
            if (cliente) {
            this.clienteRegistrado = cliente;
            this.nombreCliente = cliente.nombre;
            this.apellidoCliente = cliente.apellido;
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
    

  // Método para registrar un cliente si no existe
    registrarCliente(): void {
        if (!this.cedulaCliente.trim() || !this.nombreCliente.trim() || !this.apellidoCliente.trim()) {
        this.mensajeError = 'Todos los campos son requeridos';
        return;
        }

        // Verificar si el cliente ya existe
        this.clienteService.buscarPorCedula(this.cedulaCliente).subscribe(
        (cliente: Cliente | null) => {
            if (cliente) {
            this.clienteRegistrado = cliente;
            this.mensajeExito = 'Cliente encontrado';
            this.mensajeError = '';
            this.finalizarOrden(cliente); // Finalizar la venta con el cliente existente
            this.cerrarModalCliente(); // Cierra el modal
            } else {
            // Registrar nuevo cliente
            const nuevoCliente: Cliente = {
                idCliente: 0, // El ID será asignado por el backend
                cedula: this.cedulaCliente,
                nombre: this.nombreCliente,
                apellido: this.apellidoCliente
            };

            this.clienteService.registrarCliente(nuevoCliente).subscribe(
                (cliente: Cliente) => {
                this.clienteRegistrado = cliente;
                this.mensajeExito = 'Cliente registrado exitosamente';
                this.mensajeError = '';
                this.finalizarOrden(cliente); // Finalizar la venta con el cliente registrado
                this.cerrarModalCliente(); // Cierra el modal
                },
                error => {
                this.mensajeError = 'Error al registrar cliente';
                }
            );
            }
        },
        error => {
            this.mensajeError = 'Error al buscar cliente';
        }
        );
    }
  
    // Método para finalizar la venta y guardar la orden
    finalizarOrden(cliente: Cliente): void {
        if (!this.isEdit && this.ventaService.getCarrito().length === 0) {
        this.mensajeError = 'El carrito está vacío';
        return;
        }

        this.venta.idCliente = cliente.idCliente;
        this.venta.total = this.ventaService.calcularTotal();

        this.venta.detalles = this.ventaService.getCarrito().map((item, index) => ({
        idVenta: this.venta.idVenta,
        idDetalleVenta: index + 1,
        idProducto: item.idProducto,
        cantidad: item.cantidad,
        precioVenta: item.precioVenta
        }));

        // Guardar la venta
        this.ventaService.finalizarVenta(this.venta).subscribe(
        () => {
            this.ventaService.limpiarCarrito();
            this.mensajeExito = 'Orden finalizada exitosamente';
            this.mensajeError = '';
            setTimeout(() => {
            this.router.navigate(['/ventas']);
            }, 1500);
        },
        error => {
            this.mensajeError = 'Error al finalizar la orden';
        }
        );
    }

    private cargarDatosVenta(venta: Venta): void {
        this.clienteService.getClienteById(venta.idCliente).subscribe(
        (cliente: Cliente | null) => {
            if (cliente) {
            this.clienteRegistrado = cliente;
            this.cedulaCliente = cliente.cedula;
            this.nombreCliente = cliente.nombre;
            this.apellidoCliente = cliente.apellido;
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
  

    getProductoNombre(idProducto: number): string {
        const producto = this.productos.find(p => p.idProducto === idProducto);
        return producto ? producto.nombre : '';
    }

    getCarritoItems(): DetalleVenta[] {
        return this.ventaService.getCarrito();
    }
}
