import { Component, EventEmitter, forwardRef, OnInit, Output, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import * as moment from 'moment';
import MaterialDateTimePicker from 'material-datetime-picker';
import { sessionSettings } from 'app/globals';

@Component({
  selector: 'home-datetime-range-picker',
  template: `
    <label>Start</label>
    <mat-form-field>
      <input matInput
             [(ngModel)]="start"
             #datePickerInput />
      <mat-icon matSuffix>event</mat-icon>
    </mat-form-field>
  `,
  styles: [`
    /deep/ home-datetime-range-picker .mat-form-field-infix {
      border: 0 !important;
    }
    /deep/ .c-datepicker__clock__minutes,
    /deep/ .c-datepicker__clock__hours {
      position: relative;
      margin-top: -80px;
    }
    /deep/ .c-datepicker__header-date {
      height: auto;
    }
    /deep/ .c-datepicker__toggle {
      top: 48px;
    }
    /deep/ .c-datepicker__day--disabled {
     color: #f44336;
    }
    /deep/ .c-datepicker__day--disabled:hover {
      cursor: not-allowed;
      color: #f44336;
    }
    /deep/ .c-datepicker__day--disabled:before {
      display: none;
    }
    /deep/ .c-datepicker__minute--disabled {
      pointer-events: none;
      color: #bbb;
    }
    /*/deep/ .c-datepicker__clock__minutes {*/
      /*display: none;*/
    /*}*/
    /deep/ .c-datepicker--open, 
    /deep/ .c-scrim--shown {
      z-index: 999;
    }
    /deep/ .c-datepicker {
      max-height: 100vh;
      overflow: scroll;
      min-height: 0;
    }
    
    /deep/ .c-datepicker .modal-btns {
      float: none;
      display: block;
      position: relative;
      padding: 0 32px 18px;
      text-align: right;
    }
    /deep/ .c-datepicker__header-date__month,
    /deep/ .c-datepicker__header-date__time {
      font-size: 18px;
    }
    /deep/ .c-datepicker__header-date__day {
      font-size: 36px;
    }
    /deep/ .c-datepicker__clock {
      height: auto;
    }
    /deep/ .c-datepicker__clock::before {
      top: 60px;
    }
    
    
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
  _start: Date;

  get start(): string {
    return moment(this._start).format('MM/DD/YY hh:mm a');
  }
  set start(d: string) {
    console.log(d);
    this._start = moment(d).toDate();
    this.propagateChange(this._start);
  }

  picker: any;
  $picker: any; // jquery object
  @ViewChild('datePickerInput') datePickerInput: any;

  constructor() {
    this.start = moment().startOf('day').format();
  }

  ngOnInit() {
    this.renderPicker();
  }

  renderPicker() {
    const settings = {
      format: 'MM/DD/YY hh:mm a',
      default: this.start,
      dateValidator(d) {
        const m = moment();
        return m.isBefore(d) && m.isBefore(moment(m).add(3, 'months'));
      },
    };

    this.picker = new MaterialDateTimePicker(settings)
      .on('submit', start => {
        this.start = start.toDate();
      })
      .on('open', () => {
        this.$picker = (<any>window).$(this.picker.pickerEl);
        this.disableInvalidMinutes();
      })
      .on('*', (type, val) => {
        setTimeout(() => {
          this.$picker.find('td.c-datepicker__day-body')
            .off('click')
            .on('click', () => {
              this.picker.clickShowClock();
              this.picker.showHourClock();
            });
        }, 10);

      });

    (<any>window).$(this.datePickerInput.nativeElement)
      .on('click', () => this.picker.open());
  }

  disableInvalidMinutes() {
    this.$picker
      .find('.c-datepicker__clock__minutes .c-datepicker__clock__num')
      .toArray()
      .map(el => {
        const minutes = +el.getAttribute('data-number');

        if (minutes % (sessionSettings.increment * 60) !== 0) {
          el.className += ' c-datepicker__minute--disabled';
        }
      });

  }

  writeValue(start: any): void {
    this.start = start;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  propagateChange = (_: any) => {
  };
}
