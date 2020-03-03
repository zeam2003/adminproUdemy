import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

import 'rxjs/add/operator/map';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
// import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    // public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
    } else {
      this.token = '';
      this.usuario = null;
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );

    this.usuario = usuario;
    this.token = token;
  }

  logout() {
    this.usuario = null;
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                .map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario );
                  return true;
                });


  }

  login( usuario: Usuario, recordar: boolean = false ) {

    let prueba: any;
    if ( recordar ) {
      localStorage.setItem('email', usuario.email );
    } else {
      localStorage.removeItem('email');
    }

    let url = URL_SERVICIOS + '/login';
    return this.http.post( url, usuario )
                .map( (resp: any ) => {

                  prueba = resp.usuario;
                  console.log('Respuesta del Log 2', resp);
                  console.log('Respuesta del Log 3', resp.id);
                  console.log('Respuesta dle log 4', resp.usuario);
                  console.log('Respuesta del log 5', prueba);

                  // this.guardarStorage( resp.id, resp.token, resp.usuario);

                  /* localStorage.setItem('id', resp.id);
                  localStorage.setItem('token', resp.token);
                  localStorage.setItem('usuario', JSON.stringify(resp.usuario)); */

                  this.guardarStorage( resp.id, resp.token, prueba  );

                  return true;

                /* .map( (resp: any) => {
                  console.log('Esto recibo en el login', usuario);
                  this.guardarStorage( resp.id, resp.token, resp.usuario );

                  return true; */
                });

  }


  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
              .map( (resp: any) => {

                Swal.fire('Usuario creado', usuario.email, 'success' );
                return resp.usuario;
              });
  }

  actualizarUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario/' + usuario._id;
    url += '?token=' + this.token;
    console.log('usuario id', usuario._id);

    return this.http.put( url, usuario )
                .map( (resp: any) => {


                  if ( usuario._id === this.usuario._id ) {
                    this.usuario = resp.usuario;
                    this.guardarStorage( usuario._id, this.token, usuario );
                  }

                  // let usuarioDB: Usuario = resp.usuario;


                  Swal.fire('Usuario actualizado', usuario.nombre, 'success' );

                  return true;
                });

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any ) => {
          this.usuario.img = resp.usuario.img;
          Swal.fire( 'Imagen Actualizada', this.usuario.nombre, 'success');

          this.guardarStorage( id, this.token, this.usuario);
        })
        .catch( resp => {
          console.log(resp);
        });
  }

  /* cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
          .then( (resp: any) => {

            this.usuario.img = resp.usuario.img;
            swal( 'Imagen Actualizada', this.usuario.nombre, 'success' );
            this.guardarStorage( id, this.token, this.usuario );

          })
          .catch( resp => {
            console.log( resp );
          }) ;

  }
 */

 cargarUsuarios( desde: number = 0 ) {

    let url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
 }

 buscarUsuarios( termino: string ) {

  let url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

  return this.http.get( url )
            .map ( (resp: any) => resp.usuarios);
 }


 borrarUsuario( id: string ) {


  let url = URL_SERVICIOS + '/usuario/' + id;
  url += '?token=' + this.token;

  return this.http.delete( url )
            .map( resp => {
              return true;
            });
 }
}
