import { Doc } from './doc';

export class Event extends Doc {
  title: string;
  body: string;
  attendees: Array<string>;

  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zipCode: string;

  start_date: string;
  end_date: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;

  constructor() {
    super();
    this.created_at = this.createdAt;
    this.updated_at = this.updatedAt;
  }
}
