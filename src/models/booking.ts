import { Bookable } from 'models/bookable';

import { _id, Doc } from './doc';


export class Booking extends Doc {
  booker: string; // id of user booking
  bookable: Bookable | _id;
  time: {
    start: Date;
    end: Date;
  };
  invoiceAmount: number;
  chargeAmount = 0;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  hours: number; // length in hours of session
}
