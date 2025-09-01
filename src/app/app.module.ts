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
import { CambiarContrasenaModalComponent } from './modals/cambiar-contrasena-modal/cambiar-contrasena-modal.component';
import { AgregarInicioMunicipioModalComponent } from './modals/agregar-inicio-municipio-modal/agregar-inicio-municipio-modal.component';
import { AgregarInicioDependenciaModalComponent } from './modals/agregar-inicio-dependencia-modal/agregar-inicio-dependencia-modal.component';
import { AgregarVisitasModalComponent } from './modals/agregar-visitas-modal/agregar-visitas-modal.component';
import { EditarVisitasModalComponent } from './modals/editar-visitas-modal/editar-visitas-modal.component';
import { InspeccionesComponent } from './components/inspecciones/inspecciones.component';
import { ProgramarFechasComponent } from './components/programar-fechas/programar-fechas.component';
import { ModalFechaInspeccionComponent } from './modals/modal-fecha-inspeccion/modal-fecha-inspeccion.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';
import { ConversacionComponent } from './components/conversacion/conversacion.component';
import { EditarInicioMunicipioModalComponent } from './modals/editar-inicio-municipio-modal/editar-inicio-municipio-modal.component';
import { EditarInicioDependenciaModalComponent } from './modals/editar-inicio-dependencia-modal/editar-inicio-dependencia-modal.component';

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
    CerrarSesionModalComponent,
    CambiarContrasenaModalComponent,
    AgregarInicioMunicipioModalComponent,
    AgregarInicioDependenciaModalComponent,
    AgregarVisitasModalComponent,
    EditarVisitasModalComponent,
    InspeccionesComponent,
    ProgramarFechasComponent,
    ModalFechaInspeccionComponent,
    ChatSidebarComponent,
    ConversacionComponent,
    EditarInicioMunicipioModalComponent,
    EditarInicioDependenciaModalComponent
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
