import { MatSnackBar } from '@angular/material';
import { User } from 'models/user';
import { first, map, share, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import * as moment from 'moment';

import { Booking } from 'models/booking';
import { ModalService } from 'app/core/modal.service';
import { AuthService } from 'app/core/auth/auth.service';
import { BookableService } from 'app/main/sessions/bookable.service';
import { ToastService } from 'app/core/toast.service';
import { UserService } from 'app/core/user/user.service';
import { BookCycle } from 'models/book-cycle';

@Component({
  selector: 'home-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.scss']
})
export class SessionsComponent implements OnInit {

  upcomingSessions$: Observable<Array<Booking>>;
  pastSessions$: Observable<Array<Booking>>;

  cycles$: Observable<Array<BookCycle>>;

  constructor(
    private modal: ModalService,
    private auth: AuthService,
    private bookableService: BookableService,
    private userService: UserService,
    private toastService: ToastService,
    private snack: MatSnackBar,
  ) {
  }

  ngOnInit() {
    const bookings$ = this.auth.getCurrentUser(true).pipe(
      first(),
      switchMap((u: User) => this.bookableService.getBookingsForUser(u._id)),
      tap((b) => console.log(b)),
      share(),
    );

    this.upcomingSessions$ = bookings$.pipe(map(bookings => (
      bookings.filter(b => moment().isBefore(b.time.start))
    )));
    this.pastSessions$ = bookings$.pipe(map(bookings => (
      bookings.filter(b => moment().isAfter(b.time.start))
    )));

    // this.cycles$ = this.userService.getCurrentBookCycles().share();
  }

  cancel(session: Booking) {

    this.modal.popup({
      type: 'info',
      html: `Are you sure you want to cancel your session on ${moment(session.time.start).format('MMM Do @ h:mm a')}? This action cannot be undone. *** Due to full schedules, if you choose to cancel your session, you will only receive 50% of your payment. If your session is within 72 hours, there will be no refund given. There will be a grace period of 1 hour after booking.`,
      confirmButtonText: 'Cancel Session',
      cancelButtonText: 'Nevermind',
    })
      .then(doCancel => {
        if (!doCancel) return;

        this.bookableService.cancel(session)
          .subscribe(
            res => {
              Object.assign(session, res);
              this.snack.open('Session cancelled successfully', null, {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
              });
            },
            err => {
              console.log(err);
              this.modal.error();
            }
          )
      })

  }
}
