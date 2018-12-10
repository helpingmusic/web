import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'home-walkthrough',
  templateUrl: './walkthrough.component.html',
  styleUrls: ['./walkthrough.component.scss']
})
export class WalkthroughComponent implements OnInit {

  steps = [
    'Account',
    'Subscription',
    'About',
    'Profile',
    'Done',
  ];

  currentStep: string;

  constructor(router: Router) {
    router.events.subscribe(e => {
      if (e instanceof NavigationEnd) {
        const s = +e.urlAfterRedirects.split('/').pop();
        if (s) this.currentStep = 'step-' + s;
      }
    });
  }

  ngOnInit() {
  }

}
