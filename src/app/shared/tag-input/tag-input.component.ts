import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material';

@Component({
  selector: 'home-tag-input',
  templateUrl: './tag-input.component.html',
  styleUrls: ['./tag-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TagInputComponent),
      multi: true
    }
  ]
})
export class TagInputComponent implements OnInit, ControlValueAccessor {

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input() placeholder: string;
  @Input() description: string;
  @Input() autocompleteOptions: string[];
  list: string[];

  inputCtrl = new FormControl();

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || '').trim();

    if (value) {
      this.list.push(value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.propagateChange(this.list);
  }

  remove(index: number) {
    this.list.splice(index, 1);
    this.propagateChange(this.list);
  }

  writeValue(list: string[]): void {
    this.list = list || [];
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

}
