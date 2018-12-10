import { from, Subject } from 'rxjs';

import { concatMap, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { Component, forwardRef, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'home-stripe-input',
  template: `
    <label class="control-label mt-n">Credit or Debit Card</label>
    <home-loader class="xs" [hidden]="!isLoading"></home-loader>
    <div #cardEl class="form-control"></div>
    <p class="hint error">{{err}}</p>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
    }

    home-loader {
      position: absolute;
      top: 0;
      right: 0;
    }

    label {
      padding: 0;
      margin: 0px 0 -10px;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => StripeInputComponent),
      multi: true
    }
  ]
})
export class StripeInputComponent implements OnInit, ControlValueAccessor {

  stripe: any;
  elements: any;
  card: any;
  public err: string;
  @ViewChild('cardEl') cardEl;
  isLoading: boolean;

  token: any;

  propagateChange = (_: any) => {
  };

  constructor() {
    this.stripe = (<any>window).stripe;
    this.elements = this.stripe.elements();
  }

  ngOnInit() {
    const style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    this.card = this.elements.create('card', { style: style });
    this.card.mount(this.cardEl.nativeElement);

    const changes = new Subject<any>();

    changes.pipe(
      tap(e => this.err = e.error && e.error.message),
      filter(event => event.complete),
      debounceTime(100),
      tap(() => this.isLoading = true),
      switchMap(() => from(this.stripe.createToken(this.card))),
      map(({ error, token }: any) => {
        this.isLoading = false;
        this.err = error && error.message;
        return token;
      }),)
      .subscribe(
        token => {
          this.token = token;
          this.propagateChange(this.token);
        },
      );

    this.card.addEventListener('change', e => changes.next(e));
  }

  clear() {
    this.card.clear();
    this.token = null;
    this.propagateChange(this.token);
  }

  writeValue(token: any): void {
    this.token = token;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }
}
