import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ListarVentasComponent } from './listar/listar.component';
import { CrearEditarVentaComponent } from './crear-editar/crear-editar.component';
import { VentaService } from './venta.service';
import { ClienteService } from '../clientes/cliente.service';
import { VentasRoutingModule } from './ventas-routing.module';

@NgModule({
  declarations: [
    ListarVentasComponent,
    CrearEditarVentaComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    VentasRoutingModule
  ],
  providers: [
    VentaService,
    ClienteService
  ],
  exports: [
    ListarVentasComponent,
    CrearEditarVentaComponent
  ]
})
export class VentasModule { }
