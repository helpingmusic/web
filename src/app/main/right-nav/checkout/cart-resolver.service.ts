import { first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Cart } from 'models/cart';
import { CheckoutService } from 'app/core/checkout.service';

@Injectable()
export class CartResolver implements Resolve<Cart> {

  constructor(
    private router: Router,
    private checkoutService: CheckoutService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Cart> {
    return this.checkoutService.getCart().pipe(
      first(),
      map(cart => {
        if (!cart) {
          this.router.navigate([{ outlets: { s: null } }]);
        }
        return cart;
      }),)
  }

}
