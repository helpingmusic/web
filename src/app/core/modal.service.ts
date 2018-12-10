import { Injectable } from '@angular/core';

import { default as swal } from 'sweetalert2';

/**
 *  ModalService
 *
 *  Wraps swal in a service
 *  Different from the ModalComponent
 */

@Injectable()
export class ModalService {

  constructor() {
    swal.setDefaults(<any>{
      showCancelButton: true,
      customClass: 'home-modal text-left',
      buttonsStyling: false,
      showCloseButton: true,
      showLoaderOnConfirm: true,
      confirmButtonClass: 'btn btn-info pull-right ml-md',
      cancelButtonClass: 'btn btn-default pull-left',
      type: 'question',
      onOpen: () => {
        $.material.init('.home-modal *');
      },
      useRejections: true,
    });
  }

  popup(options: any): any {
    return swal(options)
      .catch(swal.noop);
  }

  error(options: any = {}): any {
    return this.popup(
      Object.assign({
        type: 'error',
        title: 'Attempt Failed',
        text: 'Something went wrong, please try again later',
        showCancelButton: false,
      }, options)
    );
  }

}
