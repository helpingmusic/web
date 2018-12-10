import { zip as observableZip } from 'rxjs';

import { first } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { CheckoutService } from 'app/core/checkout.service';
import { Cart } from 'models/cart';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'home-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  cart: Cart;
  @ViewChild('checkoutForm') checkoutForm: NgForm;
  errors: any = {};

  currentCard: any;
  method = 'new';
  couponValid: boolean;
  promoOption: boolean;
  showPromo: boolean;
  couponIsLoading: boolean;
  formIsLoading: boolean;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
    $.material.init('home-checkout');
    this.checkoutService.setCartComponent(this);

    this.route.data
      .subscribe((data: { cart: Cart }) => {
        this.cart = data.cart;
        this.showPromo = !!this.cart.couponCode;
        this.promoOption = this.cart.couponAvailable;

        if (this.cart.couponCode) {
          this.validateCoupon(this.cart.couponCode);
        }
      });

    observableZip(this.auth.getCurrentUser(), this.auth.getStripeCustomer()).pipe(
      first())
      .subscribe(([u, cust]) => this.cart.accountBalance = (u.credits * 100) - cust.accountBalance);

    this.checkoutService.getPaymentOptions()
      .subscribe(card => {
        this.currentCard = card;
        if (this.currentCard && this.currentCard.id) {
          this.method = 'current';
        }
      });
  }

  validateCoupon(code?: string) {
    this.couponIsLoading = true;

    code = code || this.checkoutForm.value.couponCode;
    this.cart.applyCoupon(code).pipe(
      first())
      .subscribe(message => {
        this.errors.couponCode = message;
        this.couponIsLoading = false;
      });
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return false;

    const tokenId = form.value.token ? form.value.token.id : null;

    this.formIsLoading = true;
    this.checkoutService.execute({
      token: tokenId,
      couponCode: form.value.couponCode,
    })
      .subscribe(
        () => this.close(),
        err => this.errors.form = err.message,
        () => this.formIsLoading = false,
      );
  }

  ngOnDestroy() {
    this.checkoutService.cancel();
  }

  close() {
    this.router.navigate([{ outlets: { s: null } }], { relativeTo: this.route.parent })
  }

}
