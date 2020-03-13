import { Injectable } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { URL_SERVICIOS } from '../../config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';
import { Observable } from 'rxjs/observable';


import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs';

// import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable()
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public _subirArchivoService: SubirArchivoService
    // public _subirArchivoService: SubirArchivoService
  ) {
    this.cargarStorage();
  }

  renuevaToken() {

    let url = URL_SERVICIOS + '/login/renuevatoken';
    url += '?token=' + this.token;

    return this.http.get( url )
                .map ( (resp: any) => {
                  this.token = resp.token;
                  localStorage.setItem( 'token', this.token );
                  console.log('Token Renovado');
                  return true;
                })
                .catch( err => {
                  this.router.navigate(['/login']);
                  Swal.fire('No se pudo renovar Token', 'No fue posible renovar el token', 'error');
                  return  throwError(err );
                });
  }

  estaLogueado() {
    return ( this.token.length > 5 ) ? true : false;
  }

  cargarStorage() {

    if ( localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse( localStorage.getItem('usuario') );
      this.menu = JSON.parse( localStorage.getItem('menu') );
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }

  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {

    localStorage.setItem('id', id );
    localStorage.setItem('token', token );
    localStorage.setItem('usuario', JSON.stringify(usuario) );
    localStorage.setItem('menu', JSON.stringify(menu) );

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    let url = URL_SERVICIOS + '/login/google';

    return this.http.post( url, { token } )
                .map( (resp: any) => {
                  this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu );
                  console.log(resp);
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
                  localStorage.setItem('usuario', JSON.stringify(resp.usuario));

                  this.guardarStorage( resp.id, resp.token, prueba, resp.menu  );

                  return true;

                }).catch( err => {

                  // console.log( err.error.mensaje );
                  Swal.fire('Error en el login', err.error.mensaje, 'error');
                  return  throwError(err );
                });



  }


  crearUsuario( usuario: Usuario ) {

    let url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
              .map( (resp: any) => {

                Swal.fire('Usuario creado', usuario.email, 'success' );
                return resp.usuario;
              })
              .catch( err => {

                // console.log( err.error.mensaje );
                Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                return  throwError(err );
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
                    this.guardarStorage( usuario._id, this.token, usuario, this.menu );
                  }

                  // let usuarioDB: Usuario = resp.usuario;


                  Swal.fire('Usuario actualizado', usuario.nombre, 'success' );

                  return true;
                })
                .catch( err => {

                  // console.log( err.error.mensaje );
                  Swal.fire(err.error.mensaje, err.error.errors.message, 'error');
                  return  throwError(err );
                });

  }

  cambiarImagen( archivo: File, id: string ) {

    this._subirArchivoService.subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any ) => {
          this.usuario.img = resp.usuario.img;
          Swal.fire( 'Imagen Actualizada', this.usuario.nombre, 'success');

          this.guardarStorage( id, this.token, this.usuario, this.menu);
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
