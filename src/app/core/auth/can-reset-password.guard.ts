import { Observable, of as observableOf } from 'rxjs';

import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';


import { HttpClient } from '@angular/common/http';
import { User } from 'models/user';

/**
 *  CanResetPasswordGuard
 *
 *  Prohibit access to the reset password page
 *  Must have a existing user id in the query params
 */

@Injectable()
export class CanResetPasswordGuard implements CanActivate {

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
      this.router.navigate(['/login']);
      return observableOf(false);
    }

    return this.http.get<User>(`/users/${id}`).pipe(
      map(user => {

        // User exists
        if (user._id && user.role) {
          return true;
        }

        this.router.navigate(['/login']);
        return false;
      }));
  }

}
