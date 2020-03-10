import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { Medico } from '../../models/medico.model';
import { MedicoService } from '../../services/medico/medico.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styleUrls: ['./medicos.component.css']
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];

  constructor( public _medicoService: MedicoService) { }

  ngOnInit() {

    this.cargarMedicos();
  }

  cargarMedicos() {

    this._medicoService.cargarMedicos()
      .subscribe( medicos => this.medicos = medicos );
  }

  buscarMedico( termino: string ) {


    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this._medicoService.buscarMedicos( termino ) 
        .subscribe( medicos => this.medicos = medicos );
  }


  borrarMedico( medico: Medico ) {

    this._medicoService.borrarMedico( medico._id)
        .subscribe( () => this.cargarMedicos() );

  }


}
