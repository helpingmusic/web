import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { CheckoutService } from 'app/core/checkout.service';
import { AcceptBookingTermsModalComponent } from 'app/main/sessions/book/accept-booking-terms-modal/accept-booking-terms-modal.component';
import { BookableService } from 'app/main/sessions/bookable.service';
import { Bookable } from 'models/bookable';
import { Cart } from 'models/cart';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Observable, of as observableOf, Subscription } from 'rxjs';

import { filter, first, map, switchMap, switchMapTo, tap } from 'rxjs/operators';

@Component({
  selector: 'home-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss']
})
export class BookComponent implements OnInit, OnDestroy {

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

  userSubscription: Subscription;

  constructor(
    private bookableService: BookableService,
    private route: ActivatedRoute,
    private checkoutService: CheckoutService,
    private router: Router,
    // private toastService: ToastService,
    private snack: MatSnackBar,
    private auth: AuthService,
    private fb: FormBuilder,
    private dialog: MatDialog,
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
        this.userSubscription = this.auth.getCurrentUser()
          .pipe(first())
          .subscribe(u => this.studioRate = studio.rates[u.stripe.plan]);
      }),
    );
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onSubmit(form: FormGroup, studio: Bookable) {
    console.log(form);
    if (form.invalid) return;
    this.error = '';

    const acceptTermsDialog = this.dialog.open(AcceptBookingTermsModalComponent, {
      width: '400px',
    });

    acceptTermsDialog.beforeClosed()
      .pipe(filter(accepts => !!accepts))
      .subscribe(() => {
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
              console.log(res);
              if (checkoutSubscriber) {
                checkoutSubscriber.unsubscribe();
              }
              this.checkoutService.close();

              this.error = res.error.message || 'Could not book session.';
            }
          );
      })


  }

}
