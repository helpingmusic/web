import { Component, forwardRef, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR, Validators as val } from '@angular/forms';
import { CouponService } from 'app/core/coupon.service';
import { Coupon } from 'models/coupon';
import { Subscription } from 'rxjs';

import { first } from 'rxjs/operators';

@Component({
  selector: 'home-coupon-field',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Coupon Code</mat-label>
      <input matInput [formControl]="codeControl" (keydown.enter)="validateCoupon()" />
      
      <mat-hint *ngIf="!!coupon">{{ couponMessage }}</mat-hint>
      
      <mat-error *ngIf="codeControl.hasError('invalid')">Coupon is not valid</mat-error>

      <div matSuffix>
        <mat-progress-spinner color="primary" [diameter]="32" mode="indeterminate" *ngIf="isLoading"></mat-progress-spinner>
        <button (click)="validateCoupon()" color="primary" *ngIf="!isLoading" type="button" mat-stroked-button>
          Apply
        </button>
      </div>
    </mat-form-field>
  `,
  styles: [`
    mat-error {
      font-size: 14px;
    }
    mat-progress-spinner {
      margin: 12px 0 0;
    }
    button {
      margin-bottom: 12px;
      top: -2px;
    }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    multi: true,
    useExisting: forwardRef(() => CouponFieldComponent),
  }],
})
export class CouponFieldComponent implements ControlValueAccessor, OnInit, OnChanges, OnDestroy {
  isLoading: boolean;
  error: string;

  codeSub: Subscription;

  @Input() value: string;

  coupon: Coupon;
  codeControl: FormControl;

  // describes coupon
  get couponMessage() {
    const c = this.coupon;
    if (!c) {
      return '';
    }

    let off = '';
    if (c.percent_off) {
      off = `${c.percent_off}%`;
    } else if (c.amount_off) {
      off = `$${(c.amount_off / 100).toFixed()}`;
    }

    let desc = `Code "${c.id}" applied for ${off} off for `;
    if (c.duration === 'once') {
      desc += 'one time only.';
    } else {
      desc += `${c.duration_in_months} months.`;
    }

    return desc;
  }

  constructor(
    private couponService: CouponService,
    fb: FormBuilder,
  ) {
    this.codeControl = fb.control('');

    this.codeSub = this.codeControl.valueChanges
      .subscribe(c => this.propagateChange(c));
  }

  validateCoupon() {
    if (this.codeControl.value === '') return;
    this.isLoading = true;
    this.couponService.validate(this.codeControl.value)
      .pipe(first())
      .subscribe(
        (c: Coupon) => {
          if (c.valid) {
            this.value = c.id;
            this.coupon = c;
            return
          }
          this.codeControl.setErrors({ invalid: true });
        },
        ({ error }) => this.error = error.message,
        () => this.isLoading = false,
      );
  }

  ngOnInit() {
  }

  ngOnChanges(c) {
    if (c.value) {
      this.codeControl.setValue(this.value);
    }
  }

  ngOnDestroy(): void {
    if (this.codeSub) {
      this.codeSub.unsubscribe();
    }
  }

  writeValue(c: string): void {
    this.value = c;
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

}
