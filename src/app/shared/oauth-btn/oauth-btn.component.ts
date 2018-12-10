import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'oauth-btn',
  templateUrl: './oauth-btn.component.html',
  styleUrls: ['./oauth-btn.component.scss']
})
export class OauthBtnComponent {

  @Input() type: string;
  @Input() title: string;
  @Input() icon: string;

  private interval: any;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
  }

  openAuth() {
    (<any>window).location = '/auth/' + this.type;
  }

}
