import { Observable, of as observableOf } from 'rxjs';

import { catchError, first, mergeMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { UserService } from 'app/core/user/user.service';

@Injectable()
export class MemberResolver implements Resolve<User> {

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: AuthService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<User> {

    return this.auth.getCurrentUser().pipe(
      first(),
      mergeMap((u: User) => {
        if (route.params.id === 'me') {
          // this.router.navigate(['/member', u._id].concat(urlComponents.splice(urlComponents.indexOf('me'))));
          return observableOf(u);
        }
        if (route.params.id === u._id) {
          return observableOf(u);
        }
        return this.userService.getById(route.params.id);
      }),
      catchError(err => {
        this.router.navigate(['/member', 'me']);
        return observableOf(new User());
      }),);

  }
}
