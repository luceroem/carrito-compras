import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';  // Importa el nuevo método
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module'; // Asegúrate de importarlo

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule // Se debe incluir el AppRoutingModule aquí
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}
