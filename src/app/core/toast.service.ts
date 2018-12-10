import { Injectable } from '@angular/core';

@Injectable()
export class ToastService {

  constructor() {
  }

  toast(message: string) {
    $.snackbar({
      content: message,
      type: 'toast',
      timeout: 5000,
      htmlAllowed: true,
    });
  }

}
