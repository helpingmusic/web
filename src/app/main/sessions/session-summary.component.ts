import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import * as moment from 'moment';

import { Booking } from 'models/booking';

@Component({
  selector: 'home-session-summary',
  template: `
      <div>
        <table class="table m-n">
          <tr>
            <th>Date</th>
            <td>{{session.time.start | date:'short' }}</td>
          </tr>
          <tr>
            <th>Duration</th>
            <td>{{ duration }} hours</td>
          </tr>
          <tr>
            <th>Charged</th>
            <td>$ {{session.invoiceAmount | stripePrice}}</td>
          </tr>
          <tr>
            <th>Booked On</th>
            <td>{{session.createdAt | date:'short' }}</td>
          </tr>
        </table>
      </div>
  `,
})
export class SessionSummaryComponent implements OnInit {

  @Input() session: Booking;
  collapsed = true;
  isUpcoming: boolean;

  get duration() {
    return moment(this.session.time.end).diff(this.session.time.start, 'hours', true).toFixed(1);
  }

  ngOnInit() {
    this.isUpcoming = moment().isBefore(this.session.time.start)
  }

}
