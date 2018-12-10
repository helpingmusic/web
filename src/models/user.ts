import { Doc } from './doc';

class NotifiableMedium {
  browser: boolean;
  email: boolean;
}

export class User extends Doc {
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  emailConfirmed: boolean;
  role: string;
  hasPassword: boolean;
  provider: string;

  membership_types: Array<string> = [];
  profession: string;
  bio: string;

  profile_pic: string;
  banner = '';
  personal_links: any = {};

  instruments: Array<string> = [];
  genres: Array<string> = [];
  skills: Array<string> = [];
  resources: Array<string> = [];

  city: string;
  state: string;

  credits: number;
  stripe: {
    subscriptionId: string;
    customerId: string;
    accountBalance: number;
    plan: string;
    name: string;
    frequency: string;
    tier: string;
    trial_end: string;
    couponUsed: string;
    couponEnd: Date;
    card: {
      id: string,
      last4: string,
      brand: string,
      expMonth: number,
      expYear: number,
    }
  };
  plan: string;
  // Stripe customer representation
  customer: any;

  applyToPA: boolean;

  active_until: string;
  isActive: boolean;
  profileComplete: boolean;
  referralCode: string;

  pushSubscriptions: [{
    _id: string;
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    }
  }];

  notifications: {
    account: NotifiableMedium;
    application: NotifiableMedium;
    discount: NotifiableMedium;
    event: NotifiableMedium;
    post: NotifiableMedium;
    announcement: NotifiableMedium;
    review: NotifiableMedium;
  };

  constructor(values: any = {}) {
    super();

    Object.assign(this, values);
    //   set defaults
    this.notifications = this.notifications || {
      account: {} as NotifiableMedium,
      application: {} as NotifiableMedium,
      discount: {} as NotifiableMedium,
      event: {} as NotifiableMedium,
      post: {} as NotifiableMedium,
      announcement: {} as NotifiableMedium,
      review: {} as NotifiableMedium,
    };
  }
}
