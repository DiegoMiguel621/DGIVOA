import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { VisitasComponent } from './components/visitas/visitas.component';
import { IniciosObraComponent } from './components/inicios-obra/inicios-obra.component';
import { EmpleadosComponent } from './components/empleados/empleados.component';

import { AgregarEmpleadosModalComponent } from './modals/agregar-empleados-modal/agregar-empleados-modal.component';
import { EditarEmpleadosModalComponent } from './modals/editar-empleados-modal/editar-empleados-modal.component';
import { EliminarEmpleadoModalComponent } from './modals/eliminar-empleado-modal/eliminar-empleado-modal.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { RestaurarEmpleadoModalComponent } from './modals/restaurar-empleado-modal/restaurar-empleado-modal.component';
import { CerrarSesionModalComponent } from './modals/cerrar-sesion-modal/cerrar-sesion-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    InicioComponent,
    AsideComponent,
    HeaderComponent,
    FooterComponent,
    PerfilComponent,
    VisitasComponent,
    IniciosObraComponent,
    EmpleadosComponent,
    AgregarEmpleadosModalComponent,
    EditarEmpleadosModalComponent,
    EliminarEmpleadoModalComponent,
    RestaurarEmpleadoModalComponent,
    CerrarSesionModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule, 
    AppRoutingModule,
    MatDialogModule,
    FormsModule
  ],
  providers: [
    provideHttpClient(withFetch()),// Configuración recomendada en Angular 17
    provideHttpClient(withFetch()), provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
