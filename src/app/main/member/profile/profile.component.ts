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

  links = [];
  linkIcons = {
    site: 'fa-suitcase',
    facebook: 'fa-facebook',
    twitter: 'fa-twitter',
    soundcloud: 'fa-soundcloud',
    spotify: 'fa-spotify',
    instagram: 'fa-instagram',
    youtube: 'fa-youtube',
  };

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
            this.links = Object.keys(u.personal_links)
              .filter(k => !!u.personal_links[k])
              .map(key => ({ key, link: u.personal_links[key], icon: this.linkIcons[key] }));

          })
      });
  }
}
