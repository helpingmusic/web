import { Component, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'home-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.scss'],
  animations: [
    trigger('sidebarState', [
      state('open', style({
        right: '0px'
      })),
      state('closed', style({
        right: '-400px',
      })),
      transition('closed => open', animate('200ms ease-in')),
      transition('void => open', animate('200ms ease-in')),
      transition('open => closed', animate('200ms ease-out'))
    ])
  ]
})
export class RightNavComponent implements OnInit {

  @ViewChild('sidebarOutlet') sidebarOutlet;
  state = 'closed';

  constructor() {
  }

  ngOnInit() {
  }

}
