import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { User } from 'models/user';

/**
 *  User has an active subscription
 */

@Injectable()
export class IsActiveGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      first(),
      map((u: User) => {

        if (!u.isActive) {
          this.router.navigate(['/walkthrough']);
        }

        return u.isActive;
      }),);
  }
}
