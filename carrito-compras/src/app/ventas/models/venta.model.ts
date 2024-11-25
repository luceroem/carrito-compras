import { Cliente } from '../../clientes/models/cliente.model';

export interface Venta {
  idVenta: number;
  fecha: Date;
  idCliente: number;
  total: number;
  detalles: DetalleVenta[];
}

export interface DetalleVenta {
  idVenta: number;
  idDetalleVenta: number;
  idProducto: number;
  cantidad: number;
  precioVenta: number;
  nombreProducto?: string;
}
