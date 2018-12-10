import { Observable, of as observableOf } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { User } from 'models/user';


/**
 *  Gaurd to allow access to the registration page
 *
 *  Must have a valid user id
 *  And have a pending membership
 */

@Injectable()
export class CanRegisterGuard implements CanActivate {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
  }


  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const id = next.queryParams.id;

    if (!id) {
      this.router.navigate(['/signup']);
      return observableOf(false);
    }

    return this.http.get<User>(`/users/${id}`).pipe(
      map(user => {

        if (user._id && !user.plan) {
          return true;
        }

        this.router.navigate(['/signup']);
        return false;
      }));
  }
}
