import { inject, Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Cochera } from '../interfaces/cochera';
@Injectable({
  providedIn: 'root'
})
export class CocherasService {

  constructor() { }
  auth = inject(AuthService);

  cocheras():Promise<Cochera[]> {
    return fetch("http://localhost:4200/cocheras", {
      method: "GET",
      headers: {
        authorization: "Bearer" + (this.auth.getToken()?? "")
      },
    }).then(res => res.json());
  }
  get(cocheraId: number): Promise<Cochera> {
    return fetch(`http://localhost:4200/cocheras/${cocheraId}`, {
      method: "GET",
    }).then(res => res.json());
  }

  habilitar(cochera: Cochera) {
    return fetch(`http://localhost:4200/cocheras/${cochera.id}/enable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    }).then(res => res.json());
  }

  deshabilitar(cochera: Cochera) {
    return fetch(`http://localhost:4200/cocheras/${cochera.id}/disable`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    }).then(res => res.json());
  }

  eliminar(cochera: Cochera) {
    return fetch(`http://localhost:4200/cocheras/${cochera.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.auth.getToken()}`
      }
    }).then(res => res.json());
  }

  agregar(){
    return fetch("http://localhost:4200/cocheras",{
      method:"POST",
      headers:{
        authorization: "Bearer" + (this.auth.getToken() ?? ""),
        "Content-Type": "application/json"

      },
      body: JSON.stringify({descripcion:"Agregada por API"}),
    }).then(res => res.json());
  }
}
