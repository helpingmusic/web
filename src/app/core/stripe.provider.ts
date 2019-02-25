import { InjectionToken } from '@angular/core';
import { stripePubKey } from 'app/globals';

export const StripeToken = new InjectionToken<stripe.Stripe>('stripe');

const Stripe = (<any>window).Stripe;

export const StripeProvider = {
  provide: StripeToken,
  useValue: Stripe ? Stripe(stripePubKey) : null,
};
