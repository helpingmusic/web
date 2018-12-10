import { zip as observableZip } from 'rxjs';

import { first } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

import { User } from 'models/user';
import { Coupon } from 'models/coupon';
import { plans } from 'app/globals';
import { walkthroughAnimation } from 'app/walkthrough/walkthrough.animation';
import { AuthService } from 'app/core/auth/auth.service';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';
import { ApplicationService } from 'app/core/application.service';
import { CouponService } from 'app/core/coupon.service';
import { StripeInputComponent } from 'app/shared/stripe-input.component';

@Component({
  selector: 'home-subscription',
  animations: [walkthroughAnimation],
  host: { '[@routerTransition]': '' },
  template: `
    <div class="panel panel-white no-animate">
      <div class="panel-heading">
        <h3>Subscription</h3>
      </div>

      <form class="form"
            (ngSubmit)="onSubmit(subForm)"
            #subForm="ngForm"
            action="javascript:void(0);">

        <div class="panel-body row">
          <div class="col-sm-12">
            <p>
              Setting up your Member Account is the first step for Homies. 
              This will give you access to our Member Directory, Community Jam Nights,
              and Exclusive Member Content for all membership levels.
            </p>
          </div>


          <div class="col-sm-6">
            <div class="form-group mt-n">
              <label>Choose Your Membership</label>
              <select class="form-control" [(ngModel)]="tier" name="tier" required>
                <option value="community">Community Membership</option>
                <option value="creative">Creative Membership</option>
                <option value="cowrite">Creative + Cowrite</option>
                <option value="production">Creative + Production</option>
                <option value="cowork">Creative + Cowork</option>
              </select>
            </div>
          </div>

          <div class="col-xs-12">
            <h4>Billing</h4>
            <home-stripe-input
              #stripeInput
              class="clearfix"
              name="token"
              required
              ngModel>
            </home-stripe-input>
          </div>
          <div class="col-xs-12">

            <a (click)="showPromo = true" [hidden]="showPromo" class="pull-right">Have a Promo Code?</a>
            <div class="form-group mt-n" [hidden]="!showPromo">
              <div class="input-group">
                <label for="plan" class="control-label">Coupon Code</label>

                <input type="text"
                       name="couponCode"
                       class="form-control"
                       [disabled]="user?.stripe?.couponUsed"
                       [(ngModel)]="couponCode"
                       (keyup.enter)="applyCoupon(couponCode)"
                       autocomplete="off"
                />
                <div class="input-group-btn p-n">
                  <home-btn
                    (click)="applyCoupon(couponCode)"
                    [class]="'btn btn-info btn-xs mt-lg mb-n'"
                    [type]="'button'"
                    [disabled]="!!user?.stripe?.couponUsed"
                    [isLoading]="couponIsLoading">
                    Apply
                  </home-btn>
                </div>
              </div>

              <p class="hint clear"
                 [ngClass]="{ error: !coupon?.valid }"
                 [hidden]="!coupon?.message"
                 [innerHTML]="coupon?.message">
              </p>
            </div>
          </div>

          <div class="col-xs-12">
            <h4>Summary</h4>
            <table class="table table-striped">
              <tr>
                <th>Total</th>
                <td class="text-right text-capitalize">$ {{ subscriptionCost | stripePrice }} ({{frequency}})</td>
              </tr>
              <tr>
                <th>First Invoice On</th>
                <td class="text-right text-capitalize">{{ firstInvoiceDate }}</td>
              </tr>
            </table>
          </div>
          <div class="col-xs-12">
            <h4>Referred By</h4>
            <label class="control-label mt-n">How did you find us?</label>
            <div class="form-group mt-n">
              <input type="text"
                     name="referredBy"
                     class="form-control"
                     [(ngModel)]="referredBy"
                     autocomplete="off"/>
            </div>
          </div>

        </div>

        <div class="panel-footer">
          <div class="clearfix">
            <button class="btn btn-default btn-sm pull-left"
                    (click)="back()">
              Back
            </button>

            <home-btn
              [class]="'btn btn-info btn-sm pull-right'"
              [type]="'submit'"
              [disabled]="subForm.invalid"
              [isLoading]="isLoading">
              Next
            </home-btn>

          </div>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .membershipOption {
      border-radius: 4px;
      margin-bottom: 12px;
      border: 3px solid;
      padding: 10px;
      transition: all 200ms ease 0s;
      cursor: pointer;
      background: #fff;
    }

    .membershipOption:hover {
      transform: scale(1.01);
    }

    .membershipOption span {
      text-align: center;
      color: #fff;
      width: 40px;
      height: 40px;
      font-size: 16px;
      border-radius: 50%;
      display: inline-block;
      padding: 8px;
      float: left;
    }

    .membershipOption.green {
      border-color: #00BFA5;
    }

    .membershipOption.green.selected,
    .membershipOption.green:hover {
      background: #1DE9B6;
    }

    .membershipOption.green span {
      background: #00BFA5;
    }

    .membershipOption.orange {
      border-color: #FFAB00;
    }

    .membershipOption.orange.selected,
    .membershipOption.orange:hover {
      background: #FFD740;
    }

    .membershipOption.orange span {
      background: #FFAB00;
    }

    .application-section {
      background: #f7f7f7;
      border: 2px solid #ddd;
      border-radius: 4px;
      padding: 10px;
      max-width: 90%;
      min-width: 300px;
      display: block;
      margin: 0 auto;
    }

    /deep/ span.checkbox-material span.check {
      background: #fff;
    }

    h5 {
      display: initial;
    }
  `]
})
export class SubscriptionComponent implements OnInit, AfterViewInit {
  @ViewChild('subForm') subForm: NgForm;
  @ViewChild('stripeInput') stripeInput: StripeInputComponent;
  errors: any = {};
  isLoading: boolean;

  total = 0;
  tier = 'community';
  frequency = 'monthly';

  user = new User();
  showPromo: boolean;
  couponIsLoading: boolean;
  couponCode: string;
  coupon: Coupon;
  referredBy: string;

  get firstInvoiceDate() {
    const m = moment();
    return m.format('MMMM Do, YYYY');
  }

  get subscriptionCost() {
    return plans[this.tier].price;
  }

  constructor(
    private auth: AuthService,
    private appService: ApplicationService,
    private walkthrough: WalkthroughService,
    private couponService: CouponService,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser().pipe(
      first())
      .subscribe(u => this.frequency = u.stripe.frequency || 'monthly');
  }

  ngAfterViewInit() {
    $.material.init('home-subscription *');
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;

    observableZip(
      this.auth.updateAccount({ referredBy: this.referredBy }),
      this.auth.updateSubscription({
        token: form.value.token.id,
        tier: this.tier,
        couponCode: this.couponCode,
      })
    )
      .subscribe(
        () => {
          console.log('next');
          this.walkthrough.next();
        },
        res => {
          console.log('error');
          this.isLoading = false;

          try {
            var error = JSON.parse(res.error);
          } catch (e) {
            return;
          }

          console.error(error);
          if (error.type === 'StripeCardError') {
            this.stripeInput.err = error.message;
          }

        },
        () => console.log('done'),
      );
  }

  applyCoupon(code) {
    this.couponIsLoading = true;
    this.couponService.validate(code)
      .subscribe(coup => {
        this.coupon = coup;
        this.couponIsLoading = false;
      });
  }

  back() {
    this.walkthrough.back();
  }

}
