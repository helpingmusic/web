
import {of as observableOf,  Observable } from 'rxjs';


export class CartItem {
  description: string;
  cost: number;
  count: number = 1; // amount of item

  constructor(body) {
    Object.assign(this, body);
  }
}

export class Cart {
  items: Array<CartItem>;
  couponCode?: string;
  couponAvailable?: boolean;
  notes?: Array<string>; // any notes to include on cart
  couponNotes?: Array<string>;

  subtotal = 0;
  discountedAmount = 0;
  accountBalance = 0;

  get total() {
    const t1 = this.subtotal > this.discountedAmount ? (this.subtotal - this.discountedAmount) : 0;
    return t1 > this.accountBalance ? (t1 - this.accountBalance) : 0;
  }

  get appliedAccountBalance() {
    const t1 = this.subtotal > this.discountedAmount ? (this.subtotal - this.discountedAmount) : 0;
    return t1 > this.accountBalance ? this.accountBalance : t1;
  }

  constructor(body: any) {
    Object.assign(this, body);

    this.items = this.items.map(i => new CartItem(i));

    this.subtotal = this.items.reduce((sum, i) => {
      return sum + (i.cost * (i.count || 1));
    }, 0);
  }

  applyCoupon(coup: string): Observable<string> {
    return observableOf('');
  }
}
