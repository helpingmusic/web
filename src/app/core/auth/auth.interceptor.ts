import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { StoreService } from 'app/core/store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private store: StoreService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.store.get('userToken');
    const authReq = req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });

    return next.handle(authReq);
  }
}
