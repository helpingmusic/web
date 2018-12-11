import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'home-notifications-pane',
  templateUrl: './notifications-pane.component.html',
  styleUrls: ['./notifications-pane.component.scss']
})
export class NotificationsPaneComponent implements OnInit {

  constructor(
    private router: Router,
  ) {
  }

  ngOnInit() {
  }

  async navigate(path) {
    await this.router.navigate(['app', { outlets: { s: ['notifications', path] } }], {
      skipLocationChange: true,
      replaceUrl: true,
    });
  }

}
