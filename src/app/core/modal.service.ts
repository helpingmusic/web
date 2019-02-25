import { Injectable } from '@angular/core';

import swal, { SweetAlertOptions } from 'sweetalert2';

/**
 *  ModalService
 *
 *  Wraps swal in a service
 *  Different from the ModalComponent
 */

@Injectable()
export class ModalService {

  defaults: SweetAlertOptions = {
    showCancelButton: true,
    customClass: 'home-modal text-left',
    buttonsStyling: false,
    showCloseButton: true,
    showLoaderOnConfirm: true,
    confirmButtonClass: 'btn btn-info pull-right ml-md',
    cancelButtonClass: 'btn btn-default pull-left',
    type: 'question',
  };

  async popup(options: SweetAlertOptions): any {
    const { value, dismiss } = await swal.fire({ ...this.defaults, ...options });
    if (value) {
      return value;
    }
  }

  error(options: any = {}): any {
    return this.popup({
      type: 'error',
      title: 'Attempt Failed',
      text: 'Something went wrong, please try again later',
      showCancelButton: false,
      ...options,
    });
  }

}
