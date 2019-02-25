import { zip as observableZip } from 'rxjs';

import { first, take } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators as val } from '@angular/forms';
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
  checkoutForm: FormGroup;
  errors: any = {};

  currentCard: any;
  formIsLoading: boolean;
  paymentMethods: any[];

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {
    this.checkoutForm = fb.group({
      method: ['', [val.required]],
      token: [''],
    })
  }

  ngOnInit() {

    this.checkoutService.setCartComponent(this);

    this.route.data
      .subscribe((data: { cart: Cart }) => {
        this.cart = data.cart;
      });

    observableZip(this.auth.getCurrentUser(), this.auth.getStripeCustomer()).pipe(
      first())
      .subscribe(([u, cust]) => this.cart.accountBalance = (u.credits * 100) - cust.accountBalance);

    this.checkoutService.getPaymentOptions()
      .subscribe(card => {
        this.currentCard = card;

        if (this.currentCard && this.currentCard.id) {
          this.checkoutForm.get('method').setValue(card.id);
          this.paymentMethods = [card];
        }
      });
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    const tokenId = form.value.token ? form.value.token.id : null;

    this.formIsLoading = true;
    this.checkoutService.execute({ token: tokenId })
      .pipe(take(1))
      .subscribe(
        () => this.close(),
        res => {
          console.log(res);
          this.errors.form = res.error.message;
        },
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
