import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatFormFieldControl } from '@angular/material';
import { StripeToken } from 'app/core/stripe.provider';
import { Subject } from 'rxjs';

@Component({
  selector: 'home-card-input',
  template: `
    <div #cardEl></div>
  `,
  providers: [{ provide: MatFormFieldControl, useExisting: CardInputComponent }],
  host: {
    '[class.floating]': 'shouldLabelFloat',
    '[id]': 'id',
    '[attr.aria-describedby]': 'describedBy',
  }
})
export class CardInputComponent implements MatFormFieldControl<stripe.elements.ElementChangeResponse>, OnInit, OnDestroy {
  static nextId = 0;

  inputStyle = {
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
      color: '#bc1625',
      iconColor: '#bc5a64'
    }
  };

  elements: stripe.elements.Elements;
  card: stripe.elements.Element;
  @ViewChild('cardEl') cardEl;
  isLoading: boolean;

  stateChanges = new Subject<any>();

  @Output('input') input = new EventEmitter<stripe.elements.ElementChangeResponse>();

  get value() {
    return this._value;
  }

  @Input()
  set value(t: stripe.elements.ElementChangeResponse) {
    this._value = t;
    this.stateChanges.next();
    this.input.emit(t);
  }

  private _value: stripe.elements.ElementChangeResponse;

  @Input() placeholder: string;
  @Input() required: boolean;
  @Input() disabled: boolean;
  @Input() errorState: boolean;

  shouldLabelFloat = true;
  focused = false;
  ngControl = null;
  controlType = 'home-card-input';
  id = `home-card-input-${CardInputComponent.nextId++}`;
  describedBy = '';

  get empty() {
    return !this.value;
  }

  constructor(
    @Inject(StripeToken) private stripe: stripe.Stripe,
  ) {
    this.elements = this.stripe.elements();
  }

  ngOnInit() {
    this.card = this.elements.create('card', { style: this.inputStyle });
    this.card.mount(this.cardEl.nativeElement);

    this.card.on('change', e => this.value = e);

    this.card.on('focus', () => this.focused = true);
    this.card.on('blur', () => this.focused = true);
  }

  clear() {
    this.card.clear();
  }

  ngOnDestroy() {
    this.card.unmount();
    this.stateChanges.complete();
  }

  setDescribedByIds(ids: string[]) {
    this.describedBy = ids.join(' ');
  }

  onContainerClick(event: MouseEvent) {
    if ((event.target as Element).tagName.toLowerCase() != 'input') {
      this.card.focus();
    }
  }
}
