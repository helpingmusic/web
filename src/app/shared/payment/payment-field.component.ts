import { ChangeDetectionStrategy, Component, forwardRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { StripeToken } from 'app/core/stripe.provider';
import { CardInputComponent } from 'app/shared/payment/card-input.component';
import { Subject } from 'rxjs';

import { debounceTime, filter, pluck, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'home-payment-field',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Credit Card</mat-label>
      <home-card-input (input)="onCardInput($event)" [errorState]="!!error"></home-card-input>
      <mat-error>{{error}}</mat-error>
    </mat-form-field>
  `,
  styles: [`
    mat-error {
      font-size: 14px;
    }

    mat-progress-bar {
      position: absolute;
      bottom: 0;
      left: -11px;
      right: 0;
      z-index: 9;
      width: calc(100% + 21px);

    }

    mat-progress-bar[mode=determinate] /deep/ .mat-progress-bar-buffer {
      background: #ddd;
    }

    mat-progress-bar[mode=determinate].success /deep/ .mat-progress-bar-buffer {
      background: #58b07b;
    }

    mat-progress-bar[mode=determinate].error /deep/ .mat-progress-bar-buffer {
      background: #bc1625;
    }

  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => PaymentFieldComponent),
  }],
})
export class PaymentFieldComponent implements ControlValueAccessor, OnInit {
  @ViewChild(CardInputComponent) cardInput: CardInputComponent;
  isLoading: boolean;

  _changes = new Subject<any>();

  changes = this._changes.asObservable()
    .pipe(
      tap(e => this.error = e.error && e.error.message),
      filter(event => event.complete),
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(() => this.stripe.createToken(this.cardInput.card)),
      tap(() => this.isLoading = false),
      tap(({ error }) => this.error = error && error.message),
      pluck('token'),
    );

  @Input()
  error: string;

  @Input()
  value: stripe.Token;

  get token() {
    return this.value;
  }

  set token(t: stripe.Token) {
    this.value = t;
    this.propagateChange(t);
  }

  constructor(
    @Inject(StripeToken) private stripe: stripe.Stripe,
  ) {
  }

  ngOnInit() {
    this.changes.subscribe((token: stripe.Token) => this.token = token);
  }

  onCardInput(input: stripe.elements.ElementChangeResponse) {
    this._changes.next(input);
  }

  writeValue(token: stripe.Token): void {
    this.token = token;
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

}
