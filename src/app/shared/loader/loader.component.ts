import { Component } from '@angular/core';

@Component({
  selector: 'home-loader',
  template: `<mat-progress-spinner mode="indeterminate" color="primary" [diameter]="64"></mat-progress-spinner>`,
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
}
