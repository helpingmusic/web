import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { CouponService } from 'app/core/coupon.service';
import { plans } from 'app/globals';
import { StepUpdate } from 'app/registration/registration.actions';
import { WalkthroughStep } from 'app/registration/walkthrough-step';
import * as moment from 'moment';
import { finalize, first, pluck } from 'rxjs/operators';
import { selectRegistrationState } from '../registration.reducer';
import * as fromRegistration from '../registration.reducer';
import { zip as observableZip } from 'rxjs';

export interface BillingForm {
  token: any;
  plan: string;
  couponCode: string;
  referredBy: string;
}

@Component({
  selector: 'home-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit, WalkthroughStep<BillingForm> {

  @Output() completed = new EventEmitter<BillingForm>();

  membershipPlans = [
    { id: 'community', name: 'Community Membership' },
    { id: 'creative', name: 'Creative Membership' },
    { id: 'cowrite', name: 'Creative + Cowrite' },
    { id: 'production', name: 'Creative + Production' },
    { id: 'cowork', name: 'Creative + Cowork' },
  ];

  form: FormGroup;
  isLoading: boolean;
  showCouponInput: boolean;

  get firstInvoiceDate() {
    return moment().format('MMM Do');
  }

  get subscriptionCost() {
    const p = this.form.get('plan').value;
    if (p && p in plans) {
      return plans[p].price;
    }
    return 0;
  }

  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private couponService: CouponService,
    private store: Store<fromRegistration.State>
  ) {
    this.form = fb.group({
      plan: ['community', [val.required]],
      token: [null, [val.required]],
      referredBy: [''],
      couponCode: [''],
    })
  }

  ngOnInit() {
    this.store.pipe(
      first(),
      select(selectRegistrationState),
      pluck('subscription'),
    )
      .subscribe(val => val && this.form.patchValue(val));

    this.form.valueChanges
      .subscribe(data => {
        this.store.dispatch(new StepUpdate({ step: 'subscription', data }))
      })
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return;
    this.isLoading = true;
    const { token, plan, couponCode, referredBy } = form.value;
    observableZip(
      this.auth.updateAccount({ referredBy }),
      this.auth.updateSubscription({
        token: token.id,
        tier: plan,
        couponCode,
      })
    )
      .pipe(
        first(),
        finalize(() => this.isLoading = false),
      )
      .subscribe(
        () => this.completed.emit(),
        ({ error }) => {
          console.error(error);
          if (error.type === 'StripeCardError') {
            this.form.get('token').setErrors({ server: error.message })
          }
        },
      );
  }

}
