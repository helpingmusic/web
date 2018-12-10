import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'success-icon',
  template: `
  <div class="swal2-icon swal2-success swal2-animate-success-icon">
    <div class="swal2-success-circular-line-left"></div>
    <span class="swal2-success-line-tip swal2-animate-success-line-tip"></span>
    <span class="swal2-success-line-long swal2-animate-success-line-long"></span>
    <div class="swal2-success-ring"></div>
    <div class="swal2-success-fix"></div>
    <div class="swal2-success-circular-line-right"></div>
  </div>
  `,
  styles: [`
    .swal2-animate-success-icon {
      margin: 0 20px;
      display: inline-block;
      zoom: .4;
    }
    .swal2-icon.swal2-success [class^=swal2-success-line] {
      background-color: #19A69A;
    }
    .swal2-icon.swal2-success .swal2-success-ring {
      border: 4px solid #91dcd6;
    }
    :host.xl .swal2-animate-success-icon {
      zoom: 1;
    }

  `]
})
export class SuccessIconComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
