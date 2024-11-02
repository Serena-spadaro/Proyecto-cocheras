import { Component, inject } from '@angular/core';
import { EstacionamientosService } from '../services/estacionamientos.service';
import { Estacionamiento } from '../interfaces/estacionamiento';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../components/header/header.component';
import { Reporte } from '../interfaces/reportes';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.scss'
})
export class ReportesComponent {
  estacionamientos = inject(EstacionamientosService);
  historialEstacionamientos: Estacionamiento[] = [];
  reporteEstacionamientos: Reporte[] = [];

  ngOnInit() {
    this.traerReporte();
  }
  traerReporte() {
    this.estacionamientos.estacionamientos().then(estacionadas => {
      for (let estacionada of estacionadas) {
        if (estacionada.horaEgreso != null) {
          this.historialEstacionamientos.push(estacionada);
        }

      }
      this.historialEstacionamientos.sort((a, b) => {
        if (a.horaIngreso > b.horaIngreso) {
          return 1;
        }
        if (a.horaIngreso < b.horaIngreso) {
          return -1;
        }
        return 0;
      });
      let meseslaborales: string[] = [];
      let meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      
      for (let estacionada of this.historialEstacionamientos) {
        const estacionadaConDate = { ...estacionada, horaIngreso: new Date(estacionada.horaIngreso) };
        const periodo = meses[estacionadaConDate.horaIngreso.getMonth()] + ' ' + estacionadaConDate.horaIngreso.getFullYear();
        if (!meseslaborales.includes(periodo)) {
          meseslaborales.push(periodo);
          this.reporteEstacionamientos.push({
            numero: this.reporteEstacionamientos.length + 1,
            mes: periodo,
            usos: 1,
            cobrado: estacionada.costo ?? 0
          });
        } else {
          const reporte = this.reporteEstacionamientos.find(r => r.mes === periodo)!;
          reporte.usos++;
          reporte.cobrado += estacionada.costo ?? 0;
        }
      }
    })
  }
}