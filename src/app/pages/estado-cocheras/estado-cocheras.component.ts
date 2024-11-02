import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cochera } from '../../interfaces/cochera';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { EstacionamientosService } from '../../services/estacionamientos.service';
import { CocherasService } from '../../services/cocheras.service';
import Swal from 'sweetalert2';
import { Estacionamiento } from '../../interfaces/estacionamiento';
@Component({
  selector: 'app-estado-cocheras',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './estado-cocheras.component.html',
  styleUrls: ['./estado-cocheras.component.scss']
})
export class EstadoCocherasComponent  {
  esadmin:boolean = true;

  
  // siguienteNumero: number = 1;

  auth = inject(AuthService);
  estacionamientos = inject(EstacionamientosService)
  cocherasconservice = inject(CocherasService)
  
  filas:(Cochera & {activo:Estacionamiento|null})[]=[];
  ngOnInit() {
    this.traerCocheras();
  }

  traerCocheras() {
    // Creamos una nueva promesa que devolverá el array `Cochera[]`
    return this.cocherasconservice.cocheras().then(cocheras => {
      this.filas  = []; // Declaramos el array que almacenará las filas
  
      for (let cochera of cocheras){
        // Llamamos a `buscarEstacienamientoActivo` y verificamos si la cochera está ocupada
        this.estacionamientos.buscarEstacionamientoActivo(cochera.id).then(estacionamiento => {
          this.filas.push({
            ...cochera,
            activo: estacionamiento, // Incluimos el estacionamiento activo si está ocupado
          });
        })
      }
      });
    }

      
     agregarFila() {
    this.cocherasconservice.agregar().then(()=> this.traerCocheras()).then(() => this.sortCocheras()) 
    
  }

  abrirModalNuevoCochera(idCochera: number) {
    console.log("Abriendo modal cochera", idCochera);
    Swal.fire({
      title: 'Ingrese la Patente del vehiculo',
      input: 'text',
      inputValue: " ",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "Ingrese patente valida";
        }
        return null;
      }
    }).then(res => {
      if (res.isConfirmed) {
        console.log("tengo que estacionar la patente", res.value);
        this.estacionamientos.estacionarAuto(res.value, idCochera).then(() => {
          this.traerCocheras();
        });
      }
    });
  }
  sortCocheras(){
    this.filas.sort((a,b)=> a.id > b.id ? 1 : -1)
  }
  habilitarCochera(idCochera:number){
    const cochera = this.filas.find(cochera => cochera.id ===  idCochera)!;
    if (!cochera?.deshabilitada){
      Swal.fire({
        icon: "warning",
        title:" Oops...",
        text:"Esta cochera esta habilitada",
      })
    } else{
      this.cocherasconservice.habilitar(cochera).then(()=> this.traerCocheras()).then(()=>this.sortCocheras());
    } 
  }
  deshabilitarCochera(idCochera:number){
    const  cochera  = this.filas.find(cochera => cochera.id === idCochera)!;
    if(cochera.activo){
      Swal.fire({
        icon:"warning",
        title:"Oops...",
        text:"Esta cochera esta deshabilitada"
      })
    }else{
      this.cocherasconservice.deshabilitar(cochera).then(()=> this.traerCocheras()).then(()=> this.sortCocheras());
    }
  }
  abrirModalEliminarCochera(idCochera:number){
    const cochera = this.filas.find(cochera => cochera.id === idCochera)!;
    if(!cochera.activo){
      Swal.fire({
        title: "Esta seguro de borrar la cochera?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: "Eliminar Cochera"

      }).then((result)=> {
        if(result.isConfirmed){
          this.cocherasconservice.eliminar(cochera).then(()=> this.sortCocheras());
        }
      });
    }else{
      Swal.fire({
        icon:"error",
        title:"Cochera ocupada",
        text: 'Para eliminar la cochera, primero debe cerrarse',
      })
    }
  }
  abrirModalNuevoEstacionamiento(){

  }
  abrirModalCerrarEstacionamiento(idCochera: number){
    Swal.fire({
      title: "Desea cerrar este estacionamiento?",
      text: "Una vez cerrado se procede a su cobro automatico",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: "#d33",
      confirmButtonText: 'Cerrar estacionamiento'
    }).then((result)=>{
      if(result.isConfirmed){
        this.abrirModalCobroCochera(idCochera);
      }
    });
  }
  abrirModalCobroCochera(idCochera:number){
    const cochera = this.filas.find(cochera => cochera.id ===idCochera)!;
    this.estacionamientos.close(cochera.activo?.patente!).then((res)=>{
      return Swal.fire({
        title:"Cobro de Cochera",
        text:`El monto por cobrar al tiempo transcurrido es $${res.costo}`,
        confirmButtonText: 'Cobrar'
            }).then((result) =>{
              if (result.isConfirmed){
                const Toast = Swal.mixin({
                  toast: true,
                  showConfirmButton: false,
                  timer:2000,
                  timerProgressBar:true,
                  didOpen: (toast)=> {
                    toast.onmouseenter = Swal.stopTimer;
                    toast.onmouseleave = Swal.resumeTimer;
                  }
                })
              }
            }).then(()=> this.traerCocheras()).then(()=>this.sortCocheras());
    })
  }

}