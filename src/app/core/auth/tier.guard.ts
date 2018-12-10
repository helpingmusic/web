import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable()
export class TierGuard implements CanActivate {

  constructor(private auth: AuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const tiers = route.data['tiers'] as Array<string>;
    return this.auth.hasTier(tiers) || this.auth.hasRole('admin');
  }
}
