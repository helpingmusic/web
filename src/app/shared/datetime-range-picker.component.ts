import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators as val } from '@angular/forms';

import * as moment from 'moment';

@Component({
  selector: 'home-datetime-range-picker',
  template: `
    <form [formGroup]="timeForm">
      <div class="row mb-n">
        <div class="col-sm-6">
          <mat-form-field appearance="outline">
            <mat-label>Start Date</mat-label>
            <input matInput (focus)="picker.open()" formControlName="date" [matDatepicker]="picker" placeholder="Choose a date">
            <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
            <mat-datepicker #picker></mat-datepicker>
          </mat-form-field>
        </div>

        <div class="col-sm-6">
          <mat-form-field appearance="outline">
            <mat-label>Start Time</mat-label>
            <mat-select formControlName="time" panelClass="time-picker">
              <mat-option *ngFor="let time of timeOptions" [value]="time">
                {{time}}
              </mat-option>
            </mat-select>
          </mat-form-field>
        </div>

      </div>
    </form>
  `,
  styles: [`
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatetimeRangePickerComponent),
      multi: true
    }
  ]
})
export class DatetimeRangePickerComponent implements OnInit, ControlValueAccessor {

  timeOptions = Array(24 * 2).fill(0).map((_, i) => moment().startOf('day').add(i * 0.5, 'hours').format('hh:mm A'));

  timeForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.timeForm = fb.group({
      date: [moment().add(1, 'day').toDate(), [val.required]],
      time: [moment().endOf('hour').format('hh:mm A'), [val.required]]
    });
  }

  ngOnInit() {
    this.timeForm.valueChanges
      .subscribe(v => {
        const day = moment(v.date).format('YYYY-MM-DD');
        const datetime = moment(`${day} ${v.time}`).toDate();
        this.propagateChange(datetime);
      });
  }

  writeValue(start: any): void {
    const d = moment(start);
    this.timeForm.setValue({
      date: d.toDate(),
      time: d.format('hh:mm A'),
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => {
  };
}
