import { Injectable } from '@angular/core';
import { StoreService } from 'app/core/store.service';
import { environment } from 'environments/environment';

@Injectable()
export class SwService {

  public supportsPush: boolean = ('ServiceWorker' in window) && ('PushManager' in window);
  private permission: string;
  private registration: ServiceWorkerRegistration;

  registered: Promise<boolean>;
  isResolved: (boolean) => any;

  constructor(
    private store: StoreService,
  ) {

    // Make sure browser has notifications
    if (window.navigator && navigator.serviceWorker) {
      this.registerServiceWorker();
    }

    this.registered = new Promise(((resolve, reject) => {
      this.isResolved = resolve;
    }));

  }

  registerPush(): Promise<PushSubscription> {
    return this.askPermission()
      .then(() => this.subscribePush())
      .catch(() => null);
  }

  subscribePush(): Promise<PushSubscription> {
    return this.registered
      .then(is => {
        if (!is) return null;

        return this.registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            environment.applicationServerKey
          )
        });
      });
  }

  registerServiceWorker() {
    const timeout = 20;
    let count = 0;

    return navigator.serviceWorker
      .register('sw.js', { scope: '/' })
      .then(r => {
        this.registration = r;

        return new Promise((resolve, reject) => {
          const interval = setInterval(() => {
            if (++count > timeout) {
              clearInterval(interval);
              this.isResolved(false);
              return resolve();
            }
            if (!r.active) return;

            this.isResolved(true);
            clearInterval(interval);

            // give store userToken to be able to make authenticated api calls
            const messenger = r.active || navigator.serviceWorker.controller;
            messenger.postMessage({ token: this.store.get('userToken') });

            resolve(r);

          }, 200);
        });
      })
      .catch(err => {
        // Did not approve notifications
        return false;
      });
  }

  // Ask permission to send notifications
  askPermission(): Promise<any> {
    if ((<any>Notification).permission === 'granted') {
      this.permission = (<any>Notification).permission;
      return Promise.resolve();
    }

    console.log('ask permissions');

    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(resolve);
      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    })
      .then((p: string) => this.permission = p)
      .catch(() => null);
  }

  private urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}
