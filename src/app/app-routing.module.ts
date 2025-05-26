import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
import { AgregarVisitasModalComponent } from './modals/agregar-visitas-modal/agregar-visitas-modal.component';
import { EditarVisitasModalComponent } from './modals/editar-visitas-modal/editar-visitas-modal.component';
import { InspeccionesComponent } from './components/inspecciones/inspecciones.component';
import { ProgramarFechasComponent } from './components/programar-fechas/programar-fechas.component';
import { ModalFechaInspeccionComponent } from './modals/modal-fecha-inspeccion/modal-fecha-inspeccion.component';
import { ChatSidebarComponent } from './components/chat-sidebar/chat-sidebar.component';



const routes: Routes = [
  {path:'',redirectTo:'login',pathMatch:'full'},
  {path:'login', component:LoginComponent},
  {path:'inicio',component:InicioComponent},
  {path:'aside',component:AsideComponent},
  {path:'header',component:HeaderComponent},
  {path:'footer',component:FooterComponent},
  {path:'perfil',component:PerfilComponent},
  {path:'visitas',component:VisitasComponent},
  {path:'inicios-obra',component:IniciosObraComponent},
  {path:'empleados',component:EmpleadosComponent},
  {path:'inspecciones',component:InspeccionesComponent},
  {path: 'programar-fechas', component: ProgramarFechasComponent},
  {path: 'chat', component: ChatSidebarComponent},


  //modales
  {path:'modal1',component:AgregarEmpleadosModalComponent},
  {path:'modal2',component:EditarEmpleadosModalComponent},
  {path:'modal3',component:EliminarEmpleadoModalComponent},
  {path:'modal4',component:AgregarVisitasModalComponent},
  {path:'modal5',component:EditarVisitasModalComponent},
  {path:'modal6',component:ModalFechaInspeccionComponent},


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
