import { User } from 'models/user';
import { first, map, share, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Cart } from 'models/cart';
import { AuthService } from 'app/core/auth/auth.service';
import { CheckoutComponent } from 'app/main/right-nav/checkout/checkout.component';

@Injectable()
export class CheckoutService {
  cartComponent: CheckoutComponent;

  cart$ = new BehaviorSubject<Cart>(null);
  _submission$ = new Subject<any>();
  submission$: Observable<any>;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {
  }


  /**
   *
   * @param cart <Cart> - Cart to checkout with
   * @param submitFn - the callback to execute the purchase
   */
  checkout(cart: Cart, submitFn: (any) => Observable<any>): Observable<any> {
    this.cart$.next(cart);

    const url = '/app/(' + this.router.url.substring(5).replace(/[\(\)']+/g, '') + '//s:checkout)';
    this.router.navigateByUrl(url);

    this.submission$ = this._submission$.pipe(
      first(),
      switchMap(submitFn),
      share(),);

    return this.submission$;
  }

  /**
   * To be called by the checkout component,
   *  When the user has submitted the form
   * @param form <{couponCode:string, token?:string}>
   */
  execute(form: any): Observable<any> {
    if (form.token) {
      this.auth.updateCard(form.token)
        .subscribe(
          () => this._submission$.next(form),
          res => this._submission$.error(res),
        );
    } else {
      this._submission$.next(form)
    }

    return this.submission$;
  }

  getCart(): Observable<Cart> {
    return this.cart$.asObservable();
  }

  setCartComponent(cart) {
    this.cartComponent = cart;
  }

  getPaymentOptions(): Observable<any> {
    return this.auth.getCurrentUser(true).pipe(
      first(),
      map((u: User) => u.stripe.card),
    );
  }

  close() {
    this.cartComponent.close();
  }

  cancel() {
    this._submission$.next(false);
  }


}
