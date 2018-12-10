import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';

/**
 *  Gaurd to test if user is a member
 *  Checks if they are logged in
 */

@Injectable()
export class IsMemberGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {

    return this.auth.isLoggedIn().pipe(
      map(is => {

        if (!is) {
          this.auth.redirectUrl = state.url;
          this.router.navigate(['/login']);
        }

        return is;
      }));
  }
}
