import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Login } from '../../interfaces/login';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule], /*lo importo para poder usarlo en el html */
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  //enelfrontnoquierocinfundirmenunca,seguirunaregla.
  //poresocreounainterfaz
  datosLogin: Login = {
    username: '',
    password: ''
  };

  router = inject(Router);
  auth = inject(AuthService); //INSTANCIA DE LA CLASE SERVICIO Q HICE, ahora debere llamar al metodo login de la clase

  login() {
    this.auth.login(this.datosLogin)
      .then(ok => {
        if (ok) {
          this.router.navigate(["/estado-cocheras"]);
        } else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "El usuario no existe!",
          });
        }
      });
  }
}
