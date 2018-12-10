
export class Coupon {
  id: string;
  amount_off: number;
  created: number;
  duration: string;
  duration_in_months: number;
  metadata: any;
  percent_off: number;
  valid: boolean;
  message: string;

  constructor(body: any) {
    Object.assign(this, body);

    this.setMessage();
  }

  setMessage() {
    if (!this.valid) {
      this.message = 'Coupon is not valid.';
      return;
    }

    let message = `Coupon Applied! This coupon is good for `;
    if (this.amount_off) {
      message += `$${(this.amount_off / 100).toFixed(2)} off `;
    } else {
      message += `${this.percent_off}% off `;
    }

    if (this.duration === 'once') {
      message += `for one time only.`;
    } else if (this.duration === 'forever') {
      message += `for forever.`;
    } else {
      message += `for ${this.duration_in_months} months.`;
    }

    this.message = message;
  }

}
