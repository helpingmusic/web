import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * Gaurd for custom redirecting
 *
 * This will prefix a url with "/app"
 */
@Injectable()
export class RerouteGuard implements CanActivate {

  constructor(
    private router: Router
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    const prefix = '/app';

    if (state.url.indexOf(prefix) === 0) return true;

    this.router.navigateByUrl(prefix + state.url, {
      preserveQueryParams: true,
      replaceUrl: false,
      skipLocationChange: false,
    });
    return false;
  }
}
