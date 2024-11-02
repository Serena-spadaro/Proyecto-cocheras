import { Component, Inject, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {
  esadmin:boolean=true;
  auth = inject(AuthService);
  resultadoInput: string = '';
  inject=(AuthService)

abrirModal(){
  Swal.fire({
    title:'Enter your IP adress',
    input: 'text',
    inputLabel: 'Your IP adress',
    inputValue: " ",
    showCancelButton: true, 
  }).then((result)=> {
    this.resultadoInput = result.value;
    console.log(result);
  })
}
authService= inject(AuthService)
router = inject(Router)
logout() {
  this.authService.logout(); // Llama a un método en AuthService para limpiar las credenciales
  this.router.navigate(['/login']); // Redirige al login
}
}
