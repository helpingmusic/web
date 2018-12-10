import { Directive, ElementRef, EventEmitter, Input, OnChanges, Output } from '@angular/core';

import * as $ from 'jquery';
import * as moment from 'moment';
import 'eonasdan-bootstrap-datetimepicker';

@Directive({
  selector: '[timePicker]'
})
export class TimePickerDirective implements OnChanges {
  @Input() datetime: any;
  @Input() settings: object;
  @Output() dateChange = new EventEmitter<string>();

  defaultSettings = {
    stepping: 15,
    minDate: new Date(),
    widgetPositioning: { vertical: 'bottom' },
  };

  $picker: any;

  constructor(private el: ElementRef) {
    this.setPicker();
  }

  ngOnChanges(c) {
    if (c.settings) {
      const settings = Object.assign({}, this.defaultSettings, c.settings.currentValue);

      this.$picker.data('DateTimePicker')
        .options(settings)
    }

    if (c.datetime) {
      // Make sure not a duplicate value
      if (moment(c.datetime.currentValue).isSame(c.datetime.previousValue)) return;

      this.$picker.data('DateTimePicker')
        .date(c.datetime.currentValue || null);
    }
  }

  setPicker() {
    if (this.$picker) {
      this.$picker.data('DateTimePicker').destroy();
    }

    const settings = Object.assign({}, this.defaultSettings, this.settings);

    this.$picker = (<any>$(this.el.nativeElement))
      .datetimepicker(settings)
      .on('dp.change', e => {
        if (!e.date) return;
        if (e.date.isSame(e.oldDate)) return;
        this.dateChange.emit(e.date);

        // Trigger input event,
        // so angular change Detection picks up the input
        setTimeout(() => {
          const event = document.createEvent('Event');
          event.initEvent('input', true, true);
          this.el.nativeElement.dispatchEvent(event);
        }, 0);

      });
  }

}
