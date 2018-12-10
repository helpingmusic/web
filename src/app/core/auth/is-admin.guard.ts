import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { User } from 'models/user';

/**
 *  User is an admin
 */

@Injectable()
export class IsAdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.getCurrentUser().pipe(
      first(),
      map((u: User) => {
        const is = (u.role === 'admin');
        if (!is) this.router.navigate(['/login']);
        return is;
      }),);
  }
}
