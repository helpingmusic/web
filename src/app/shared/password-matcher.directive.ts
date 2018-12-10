import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS } from '@angular/forms';

export function passwordMatcher(c: AbstractControl) {
  const pass = c.get('password');
  const confirm = c.get('confirm');
  if (!pass || !confirm) return null;

  return pass.value === confirm.value ? null : { 'nomatch': true };
}

@Directive({
  selector: '[passwordMatcher]',
  providers: [{
    provide: NG_VALIDATORS,
    multi: true,
    useValue: passwordMatcher,
  }],
})
export class PasswordMatcherDirective {
}
