import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators as val } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { CheckoutService } from 'app/core/checkout.service';
import { ToastService } from 'app/core/toast.service';
import { BookableService } from 'app/main/sessions/bookable.service';
import { Bookable } from 'models/bookable';

import { Booking } from 'models/booking';
import { Cart } from 'models/cart';
import { Moment } from 'moment';

import * as moment from 'moment';
import { Observable, of as observableOf } from 'rxjs';

import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'home-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit {

  studio$: Observable<Bookable>;
  error: string;
  @ViewChild('calPreview') calPreview: any;

  bookForm: FormGroup;

  studioRate: number;

  get canBook() {
    return isFinite(this.studioRate);
  }

  get endsAt(): Date {
    return (moment(this.bookForm.get('start').value) as Moment)
      .add(this.bookForm.get('duration').value, 'hours').toDate();
  }

  get chargeAmount() {
    if (!this.studioRate) return 0;
    return this.studioRate * this.bookForm.get('duration').value;
  }

  constructor(
    private bookableService: BookableService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private router: Router,
    // private toastService: ToastService,
    private snack: MatSnackBar,
    private auth: AuthService,
    private fb: FormBuilder,
  ) {
    this.bookForm = this.fb.group({
      start: [moment().add(1, 'day').startOf('hour'), [val.required]],
      duration: [3, [val.required, val.min(0), val.max(12)]]
    });
  }

  ngOnInit() {

    this.studio$ = this.route.data.pipe(
      map((data: { studio: Bookable }) => data.studio),
      tap(studio => {
        this.auth.getCurrentUser()
          .subscribe(u => this.studioRate = studio.rates[u.stripe.plan]);
      }),
    );
  }

  onSubmit(form: FormGroup, studio: Bookable) {
    console.log(form);
    if (form.invalid) return;
    this.error = '';

    const checkout$ = this.checkoutService.checkout(
      new Cart({
        items: [{
          cost: this.chargeAmount,
          description: `${form.value.duration} Hour session at ${studio.name}`,
        }],
        notes: [
          `*** Due to full schedules, if you choose to cancel your session, 
            you will only receive 50% of your payment. If your session is within 72 hours, 
            there will be no refund given. There will be a grace period of 1 hour after booking.`
        ]
      }),
      (checkoutForm) => {
        if (!checkoutForm) return observableOf(false);

        return this.bookableService.book({
          ...form.value,
          bookable: studio._id,
        });
      }
    );

    const checkoutSubscriber = checkout$
      .subscribe(
        (res) => {
          if (!res) return; // cancelled checkout
          this.snack.open('Session booked successfully', null, {
            duration: 5000,
            horizontalPosition: 'left',
            verticalPosition: 'top',
          });
          setTimeout(() => this.router.navigateByUrl('/my-sessions'), 10);
        },
        (res) => {
          console.log('here');
          console.log(res);
          checkoutSubscriber.unsubscribe();
          this.checkoutService.close();

          this.error = res.error.message || 'Could not book session.';
        }
      );

  }

}
