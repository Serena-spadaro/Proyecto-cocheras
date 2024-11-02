import { Router, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { EstadoCocherasComponent } from './pages/estado-cocheras/estado-cocheras.component';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';
import { ReportesComponent } from './reportes/reportes.component';
function guardaLogueado(){
   let auth = inject(AuthService );
   let router = inject(Router);

   if(auth.estaLogueado())
      return true ;
   else
   router.navigate(['/login']);//cuando me da false, en vez de dejarme en nada, me va a null
   return false;

}
export const routes: Routes = [
   { 

    path: "login",
    component: LoginComponent  /*apretando enter te hace la importacion automatica*/
    /*en la barra de busqueda de localhost:4200/login , le agrego login*/

   },
   {
    path: "estado-cocheras",
    component: EstadoCocherasComponent /*las clases se escriben con mayuscula el inicio de cada palabra, me da error sino*/
   },
   {
    path:"",
    redirectTo:"login",
    pathMatch:"full" /*para que el redirect no lo haga en todo los hijos de este path*/
   },
   {
      path: "reportes",
      component: ReportesComponent
   },
];
