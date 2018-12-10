import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';

/**
 * Determine if the walkthrough can be activated
 * The user needs to fill out the first steps before getting to later steps
 */

@Injectable()
export class StepGuard implements CanActivate {

  constructor(
    private router: Router,
    private walkthrough: WalkthroughService
  ) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const step = +state.url.split('/').pop() || Infinity;
    return this.walkthrough.getAvailableStep().pipe(
      map(maxStep => {
        const canActivate = step <= maxStep;
        if (!canActivate) this.router.navigate(['/walkthrough', maxStep]);
        return canActivate;
      }));
  }
}
