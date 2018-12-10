import * as moment from 'moment';
import { Doc } from './doc';
import { User } from './user';
import { Bookable } from 'models/bookable';

export class BookCycle extends Doc {
  user: User;
  month: string;
  bookables: Array<{
    bookable: Bookable;
    bookings: Array<string>;
    hoursAlotted: number;
    hoursRecorded: number;
  }>;

  monthString: string;

  constructor(body = {}) {
    super();
    Object.assign(this, body);

    this.monthString = moment(this.month).format('MMM YYYY');
  }
};
