import { FactoryProvider, InjectionToken } from '@angular/core';
import { stripePubKey } from 'app/globals';

export const StripeToken = new InjectionToken<stripe.Stripe>('stripe');

const Stripe = (<any>window).Stripe;

export const getStripe = () => Stripe(stripePubKey);

export const StripeProvider: FactoryProvider = {
  provide: StripeToken,
  useFactory: getStripe,
};
