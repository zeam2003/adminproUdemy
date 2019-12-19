import { Component, OnInit, Inject, ElementRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { SettingsService } from '../../services/settings.service';


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

}
