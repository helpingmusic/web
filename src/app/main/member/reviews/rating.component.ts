import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'home-rating',
  styles: [`
    .star {
      color: rgba(0,0,0,0.25);
      cursor: pointer;
    }

    .star.highlighted {
      color: #FFCA28;
    }
  `],
  template: `
    <div class="mt-xs">
      <i *ngFor="let _ of rates; let r = index"
         (click)="setRating(r+1)"
         (mouseover)="setHighlighted(r+1)"
         (mouseleave)="setHighlighted(rating)"
         class="material-icons star"
         [ngClass]="{'highlighted': ((r+1) <= highlighted)}">
        star
      </i>
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RatingComponent),
      multi: true
    }
  ]
})
export class RatingComponent implements OnInit, ControlValueAccessor {

  RATING_OPTIONS = 5;
  rates = Array(this.RATING_OPTIONS).fill(0);


  // private rating: number;
  private highlighted: number;

  @Input() readOnly: boolean;
  @Input() _rating: number;

  get rating() {
    return this._rating;
  }

  @Input()
  set rating(r: number) {
    this.highlighted = r;
    this._rating = r;

    this.propagateChange(this._rating);
  }

  constructor() {
  }

  ngOnInit() {
    this.highlighted = this.rating;
  }

  setRating(r: number) {
    if (this.readOnly) return;
    this.rating = r;
  }

  setHighlighted(h: number) {
    if (this.readOnly) return;
    this.highlighted = h;
  }

  writeValue(value: any) {
    this.setRating(value);
  }

  propagateChange = (_: any) => {
  };

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {
  }

}
