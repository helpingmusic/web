import { Component, Input } from '@angular/core';

@Component({
  selector: 'home-btn',
  template: `
    <button [type]="type" [class]="class" [disabled]="disabled || isLoading">
      <ng-content *ngIf="!isLoading"></ng-content>
      <home-loader class="small" *ngIf="isLoading"></home-loader>
    </button>
  `,
})
export class HomeBtnComponent {
  @Input() type: string;
  @Input() class: string;
  @Input() isLoading: boolean;
  @Input() disabled: boolean;

  constructor() {
  }

}
