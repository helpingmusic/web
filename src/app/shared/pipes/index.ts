import { CharLimitPipe } from 'app/shared/pipes/char-limit.pipe';
import { FromNowPipe } from 'app/shared/pipes/from-now.pipe';
import { LinkFormatPipe } from 'app/shared/pipes/link-format.pipe';
import { PrettyDatePipe } from 'app/shared/pipes/pretty-date.pipe';
import { PrettyPipe } from 'app/shared/pipes/pretty.pipe';
import { SafeUrlPipe } from 'app/shared/pipes/safe-url.pipe';
import { SecondsToTimePipe } from 'app/shared/pipes/seconds-to-time.pipe';
import { StripePricePipe } from 'app/shared/pipes/stripe-price.pipe';
import { TimePipe } from 'app/shared/pipes/time.pipe';
import { WrapLinksPipe } from 'app/shared/pipes/wrap-links.pipe';

export const Pipes = [
  CharLimitPipe,
  FromNowPipe,
  LinkFormatPipe,
  PrettyDatePipe,
  PrettyPipe,
  SafeUrlPipe,
  SecondsToTimePipe,
  StripePricePipe,
  TimePipe,
  WrapLinksPipe,
];
