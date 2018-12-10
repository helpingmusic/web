import { filter, map, share } from 'rxjs/operators';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from 'app/main/member/billing/invoice.service';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { Invoice } from 'models/invoice';
import { User } from 'models/user';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { CouponService } from 'app/core/coupon.service';
import { Coupon } from 'models/coupon';
import { StripeInputComponent } from 'app/shared/stripe-input.component';

@Component({
  selector: 'home-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit, OnDestroy {
  subscriptions: any = {};

  upcomingInvoices$: Observable<Array<Invoice>>;
  pastInvoices$: Observable<Array<Invoice>>;

  @ViewChild('stripeInput') stripeInput: StripeInputComponent;

  member = new User();
  customer: any;
  discountDescription: string;
  isActive: boolean;
  activeUntil: string;
  trialEnd: string;
  card: any;
  accountBalance: number;

  paymentFormLoading: boolean;
  errors: any = {};
  success: boolean;
  showPromo: boolean;
  couponIsLoading: boolean;
  couponCode: string;
  coupon: Coupon;

  constructor(
    public invoiceService: InvoiceService,
    private auth: AuthService,
    private modal: ModalService,
    private couponService: CouponService,
  ) {
  }

  ngOnInit() {
    const invoices$ = this.invoiceService.list().pipe(share());

    this.upcomingInvoices$ = invoices$.pipe(map(invoices => (
      invoices.filter(i => moment().isBefore(i.date * 1000))
    )));
    this.pastInvoices$ = invoices$.pipe(map(invoices => (
      invoices.filter(i => moment().isAfter(i.date * 1000))
    )));

    this.subscriptions.user = this.auth.getCurrentUser().pipe(
      filter(u => !!(u && u.stripe)))
      .subscribe(u => {
        this.member = u;
        this.accountBalance = this.member.credits;
        this.isActive = moment(u.active_until).isAfter(moment());
        this.couponCode = u.stripe.couponUsed;
        if (this.couponCode) {
          this.couponService.validate(this.couponCode)
            .subscribe(c => this.coupon = c);
        }

        if (u.active_until) {
          this.activeUntil = moment(u.active_until).format('MMM Do, YYYY');
        }
        if (u.stripe && u.stripe.trial_end) {
          this.trialEnd = moment(u.stripe.trial_end).format('MMM Do, YYYY');
        }
        if (u.stripe && u.stripe.card && u.stripe.card.last4) {
          this.card = u.stripe.card;
        }
      });

    this.subscriptions.stripe = this.auth.getStripeCustomer()
      .subscribe(cust => {
        this.customer = cust;
        this.discountDescription = this.couponService.getDiscountDescription(cust.discount);
        this.accountBalance = (-cust.accountBalance / 100) + this.member.credits;
      });

  }

  ngOnDestroy() {
    this.invoiceService.clear();
    this.subscriptions.user.unsubscribe();
    this.subscriptions.stripe.unsubscribe();
  }

  onSubmit(form) {
    this.success = false;
    if (form.invalid) return false;
    this.paymentFormLoading = true;

    this.auth.updateCard(form.value.token.id)
      .subscribe(
        res => {
          this.paymentFormLoading = false;
          this.success = true;
          this.stripeInput.clear();
        },
        err => {
          this.errors = JSON.parse(err).errors;
          this.paymentFormLoading = false;
          this.stripeInput.clear();
        }
      )
  }

  applyCoupon(code) {
    this.couponIsLoading = true;
    this.couponService.apply(code)
      .subscribe(coup => {
        this.coupon = coup;
        this.couponIsLoading = false;
      });
  }

  cancelSubscription() {

    if (this.member.stripe.tier === 'pro' || this.member.stripe.tier === 'community') {
      return this.modal.popup({
        type: 'info',
        title: 'Cancel Subscription',
        text: 'Pro & Community HOME members must contact HOME directly to cancel their subscription. Email info@helpingmusic.org for assistance.',
        confirmButtonText: 'Okay',
        showCancelButton: false,
      });
    }

    this.modal.popup({
      type: 'question',
      title: 'Cancel Subscription',
      text: 'Are you sure you wish to cancel your subscription?',
      confirmButtonText: 'Continue',
      showCancelButton: true,
    })
      .then(doCancel => {
        if (!doCancel) return;

        this.auth.cancelSubscription()
          .subscribe(
            res => {
              this.modal.popup({
                type: 'success',
                title: 'Success',
                text: `Your subscription has been cancelled, but will remain active until ${this.activeUntil}. You can renew at any time!`
              })
                .then(() => {
                  // Refresh resolved data
                  this.auth.getCurrentUser(true);
                });
            },
            err => {
              console.log(err);
              this.modal.error();
            },
          );

      })
      .catch(() => {
      });
  }
}
