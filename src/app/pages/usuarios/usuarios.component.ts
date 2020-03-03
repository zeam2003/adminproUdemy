import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../models/usuario.model';
import { UsuarioService } from '../../services/service.index';
import Swal from 'sweetalert2';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];

  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;
  totalPaginas: number = 1;
  paginaActual: number = 1;

  constructor( public _usuarioService: UsuarioService,
               public _modalUploadservice: ModalUploadService) { }

  ngOnInit() {

    this.cargarUsuarios();
    this._modalUploadservice.notificacion
        .subscribe( resp => this.cargarUsuarios() );
  }

  mostrarModal( id: string){
    this._modalUploadservice.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {

    this.cargando = true;

    this._usuarioService.cargarUsuarios( this.desde )
        .subscribe( (resp: any) => {

          console.log( resp );
          this.totalRegistros = resp.total;
         // this.totalPaginas = Math.round(this.totalRegistros / 5) ;
          // console.log('Cantidad de Paginas', this.totalPaginas);
          this.usuarios = resp.usuarios;
          this.cargando = false;
        });


  }
  

  cambiarDesde( valor: number) {

    let desde = this.desde + valor;
    console.log( desde );

    if ( desde >= this.totalRegistros  ) {
  // || this.paginaActual === this.totalPaginas
      this.totalPaginas = this.paginaActual;
      console.log('Total de Paginas', this.totalPaginas);
      return;
    }

  /*   if ( desde < 0) {
       this.totalPaginas = 0;
      this.paginaActual = 1;
      return;
    } */


    this.desde += valor;
    this.paginaActual ++;
    console.log('Pagina Actual', this.paginaActual);
    this.cargarUsuarios();
  }

  cambiarAtras( valor: number ) {
    let desde = this.desde + valor;
    console.log('Valor atras', valor);

    if ( desde < 0 ) {
      this.paginaActual = 1;
      return;
    }
    this.desde += valor;
    this.paginaActual --;
    console.log('Pagina Atras actual', this.paginaActual);
    console.log('En pagina atras total', this.totalPaginas);
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string) {
    console.log( termino );

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this._usuarioService.buscarUsuarios( termino )
        .subscribe( (usuarios: Usuario[]) => {
          console.log(usuarios);

          this.usuarios = usuarios;
          this.cargando = false;
        });
  }

  borrarUsuario( usuario: Usuario ){
    console.log(usuario);

    if ( usuario._id === this._usuarioService.usuario._id) {
      Swal.fire('No se puede borrar usuario', 'No se puede borrar así mismo', 'error');
      return;
    }

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });


    swalWithBootstrapButtons.fire({
      title: '¿Esta Seguro?',
      text: 'Esta a punto de boorar a ' + usuario.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then(( borrar ) => {
      if ( borrar.value ) {
        this._usuarioService.borrarUsuario( usuario._id )
            .subscribe( (borrado: boolean)  => {
              console.log( borrado );
              this.desde = 0;
              // this.totalPaginas = this.totalPaginas - 1;
              // console.log('En esta pagina estoy', this.paginaActual);

              // console.log( 'resultado', this.totalPaginas );

              /* if (this.totalPaginas === this.paginaActual ) {
                this.desde = this.paginaActual;
                console.log('vuelvo una pagina atras', this.desde);
                this.cargarUsuarios();

              } */

              this.cargarUsuarios();
            });
        swalWithBootstrapButtons.fire(
          'Borrado!',
          'El usuario ha sido borrado',
          'success'
        )
      } else if (
        borrar.dismiss === Swal.DismissReason.cancel
      ) {
        swalWithBootstrapButtons.fire(
          'Cancelado',
          'No se realizaron cambios',
          'error'
        );
      }
    });


    /* Swal.fire({
      title: '¿Esta seguro?',
      text: 'Esta a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      dangerMode: true,
    })
    .then((borrar) => {
      console.log(borrar);
      if (borrar) {

      }
    }); */

  }


  guardarUsuario( usuario: Usuario) {

    this._usuarioService.actualizarUsuario( usuario )
        .subscribe();
  }
}
