import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '../../services/service.index';



@Component({
  selector: 'app-accout-settings',
  templateUrl: './accout-settings.component.html',
  styles: []
})
export class AccoutSettingsComponent implements OnInit {

  // tslint:disable-next-line: variable-name
  constructor(
               // tslint:disable-next-line: variable-name
               public _ajustes: SettingsService) { }

  ngOnInit() {

    this.colocarCheck();
  }

  cambiarColor( tema: string, link: ElementRef ) {
    console.log(link);

    this.aplicarCheck( link );
    this._ajustes.aplicarTema( tema );
    }

  aplicarCheck( link: any) {

    const selectores: any = document.getElementsByClassName('selector');

    for ( const ref of selectores ) {
      ref.classList.remove('working');

    }

    link.classList.add('working');

  }

  colocarCheck() {

    const selectores: any = document.getElementsByClassName('selector');

    const tema = this._ajustes.ajustes.tema;

    for ( const ref of selectores ) {
      if( ref.getAttribute('data-theme') === tema ) {
        ref.classList.add('working');
        break;
      }

    }


  }


}
