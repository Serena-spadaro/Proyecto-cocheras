import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Estacionamiento } from '../interfaces/estacionamiento';

@Injectable({
  providedIn: 'root'
})
export class EstacionamientosService {

  constructor() { }

  auth = inject(AuthService);

  estacionamientos(): Promise<Estacionamiento[]> {
    return fetch('http://localhost:4000/estacionamientos', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.auth.getToken()}`,
      },
    }).then(res => res.json());
  }

  buscarEstacionamientoActivo(cocheraId: number) {
    return this.estacionamientos().then(estacionamientos => {
      let buscado = null;
      for (let estacionamiento of estacionamientos) {
        if (estacionamiento.idCochera === cocheraId &&
          estacionamiento.horaEgreso === null) {
          buscado = estacionamiento;
          break; // Añadido para detener el bucle si se encuentra el estacionamiento
        }
      }
      return buscado;
    });
  }

  estacionarAuto(patente: string, idCochera: number) {
    return fetch("http://localhost:4000/estacionamientos/abrir", {
      method: 'POST',
      headers: {
        authorization: `Bearer ${this.auth.getToken() ?? ''}`, // Ajustado el uso de getToken() para evitar null
        'Content-Type': "application/json", // Corregido "Content-Type"
      },
      body: JSON.stringify({
        patente: patente,
        idCochera: idCochera,
        idUsuarioIngreso: "admin"
      }),
    }).then(res => res.json());
  }
  open(patente: string, idCochera: number) {
    return fetch("http://localhost:4000/estacionamientos/open", {
      method: 'POST',
      headers: {
        authorization: "Bearer" + (this.auth.getToken() ?? ""),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patente: patente,
        idCochera: idCochera,
        idUsuarioIngreso: "admin"
      })
    }).then(res => res.json());
  }
  close(patente: string) {
    return fetch("http:localhodt:4000/estacionamientos/cerrar", {
      method: "PATCH",
      headers: {
        authorization: "Bearer" + (this.auth.getToken() ?? ""),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        patente: patente,
        idUsuarionEgreso: "admin"
      })
    }).then(res => res.json());
  }
  catch(idCochera: number): Promise<Estacionamiento> {
    return fetch(`http://localhost:4000/estacionamientos/${idCochera}`, {
      method: "GET",
    }).then(res => res.json())
  }
}
