import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Bookable } from 'models/bookable';
import { BookableService } from './bookable.service';

@Injectable()
export class BookableResolver implements Resolve<Bookable> {

  constructor(
    private router: Router,
    private bookableService: BookableService
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Bookable> {

    return this.bookableService.getByName(route.params.studio);
  }
}
