import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from 'environments/environment';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const external = req.url.indexOf('http') === 0;
    const url = external ? req.url : environment.apiURL + req.url;

    const apiReq = req.clone({ url });

    return next.handle(apiReq);
  }
}
