import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';

@Component({
  selector: 'home-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  member: User;
  isOwnAccount: boolean;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { member: User }) => {
        this.member = data.member;

        this.auth.getCurrentUser()
          .subscribe((u: User) => {
            this.isOwnAccount = (this.member._id === u._id);
            if (this.isOwnAccount) {
              this.member = u;
            }
          })
      });
  }
}
