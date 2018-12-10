import { Component, OnInit } from '@angular/core';
import { walkthroughAnimation } from 'app/walkthrough/walkthrough.animation';

@Component({
  selector: 'home-done',
  animations: [walkthroughAnimation],
  host: { '[@routerTransition]': '' },
  template: `
  <div class="col-sm-8 center-block fn">
    <div class="panel panel-default">

      <div class="panel-body">
        <h2>Success!</h2>
        <div class="text-center">
          <success-icon class="xl"></success-icon>
        </div>
        <p>You're now an official Homie!</p>
        <p>Please be sure that you do the following:</p>
        <ul>
          <li>Confirm your email.</li>
          <li>Check out the event calendar.</li>
          <li>Make some connections.</li>
          <li>Be professional.</li>
        </ul>
        <p>Welcome H.O.M.E.!</p>
      </div>

      <div class="panel-footer">
        <a routerLink="/member/me" class="btn btn-action btn-block">
          Go To Profile
        </a>
      </div>

    </div>
  </div>
  `,
  styles: [`
    p {
      font-size: 16px;
      font-weight: 700;
    }
    li {
      font-size: 16px;
    }
  `]
})
export class DoneComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}
