import { ErrorHandler, Injectable } from '@angular/core';
import * as Raven from 'raven-js';

import { environment } from 'environments/environment';

/**
 *  Report app errors to server
 */

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

  constructor() {
    Raven
      .config('https://3cce8e0cf9ba416b90042e0b1ba028ee@sentry.io/306765', {
        environment: environment.production ? 'production' : 'development',
      })
      .install();
  }

  handleError(err) {
    console.error(err);
    // Wrap all of this to prevent a feedback loop
    try {
      if (!environment.production) return;
      Raven.captureException(err.originalError || err);
      if (environment.production) {
        Raven.showReportDialog();
      }
    } catch (ravenErr) {
      console.error(ravenErr);
    }
  }

  showMessage() {

    const overlay = document.createElement('div');
    overlay.className = 'error-overlay';

    const box = document.createElement('div');
    box.innerHTML = `
      Uh Oh! Looks like there was an error on this page,
      try <a href="${window.location.href}">reloading.</a>
    `;
    box.className = 'page-error';

    overlay.appendChild(box);

    document.querySelector('body')
      .appendChild(overlay);

  }

}
