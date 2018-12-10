import { Observable, of as observableOf } from 'rxjs';

import { map, share, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Bookable } from 'models/bookable';
import { Booking } from 'models/booking';

@Injectable()
export class BookableService {

  endpoint = '/bookables';
  bookables: Array<Bookable> = [];

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * List all bookables
   *
   * @returns {Observable<Array<Bookable>>}
   */
  list(): Observable<Array<Bookable>> {
    if (this.bookables.length) {
      return observableOf(this.bookables);
    }

    const fetch$ = this.http.get<Array<Bookable>>(this.endpoint).pipe(
      map(bookables => bookables.map(b => new Bookable(b))),
      share(),);

    // Cache results
    fetch$.subscribe(bookables => this.bookables = bookables);

    return fetch$;
  }

  /**
   * Get a Bookable by the name (url slug)
   *
   * @param {string} name - url slug
   * @returns {Observable<Bookable>}
   */
  getByName(name: string) {
    return this.http.get<Bookable>(`${this.endpoint}/${name}`).pipe(
      map(b => new Bookable(b)));
  }


  /**
   * Place a booking
   *
   * @param booking <Booking>
   */
  book({ bookable: string, start: Date, duration: number }): Observable<Booking> {

    return this.http.post<Booking>(
      `/bookings`,
      { bookable: string, start: Date, duration: number },
    );
  }

  cancel(booking: Booking): Observable<Booking> {
    return this.http.post<Booking>(`/bookings/${booking._id}/cancel`, {}).pipe(
      map(newBooking => {
        // keep bookable attribute intact.
        return Object.assign(booking, newBooking, { bookable: booking.bookable });
      }))
  }

  getBookingsForUser(booker: string): Observable<Array<Booking>> {
    return this.http.get<Array<Booking>>('/bookings', { params: { booker } }).pipe(
      switchMap(bookings => {
        return this.list().pipe(
          map(bookables => {
            return bookings.map(b => {
              b.bookable = bookables.find(bookable => bookable._id === b.bookable);
              return b as Booking;
            });
          }))
      }))
  }

}
