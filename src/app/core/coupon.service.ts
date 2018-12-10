import { Observable, of as observableOf } from 'rxjs';

import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as moment from 'moment';
import { Coupon } from 'models/coupon';
import { AuthService } from 'app/core/auth/auth.service';

@Injectable()
export class CouponService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {
  }

  validate(code: string): Observable<Coupon> {
    return this.http.get<any>('/stripe/validateCoupon', {
      params: new HttpParams().set('code', code),
    }).pipe(
      map(coup => new Coupon(coup)));
  }

  apply(code: string): Observable<Coupon> {
    return this.validate(code).pipe(
      switchMap(coupon => {
        if (coupon.valid) {
          return this.auth.updatePlan({ couponCode: coupon.id }).pipe(
            map(() => coupon));
        }
        return observableOf(coupon);
      }))
  }

  // Expects a stripe discount object
  getDiscountDescription(discount: any): string {
    if (!discount) return '';

    let offAmount;
    if (discount.coupon.amount_off) {
      offAmount = '$' + (discount.coupon.amount_off / 100);
    } else { // percent off
      offAmount = discount.coupon.percent_off + '%';
    }
    let every = 'once';
    if (discount.coupon.duration === 'repeating') {
      every = 'every month';
    }
    if (discount.end) {
      const until = 'until ' + moment(discount.end * 1000).format('MMM Do, YYYY');
      return `Coupon code ${discount.coupon.id} is valid for ${offAmount} off ${every} ${until}.`
    }

    return `Coupon code ${discount.coupon.id} is valid for ${offAmount} off once.`;
  }

}
