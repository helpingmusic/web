import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { NavType } from 'app/core/nav/nav-type.enum';
import { NavService } from 'app/core/nav/nav.service';
import { NotificationService } from 'app/core/notification.service';
import { MembershipTiers } from 'app/globals';
import { User } from 'models/user';
import { take } from 'rxjs/operators';

@Component({
  selector: 'home-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  user: User = new User();
  isAdmin: boolean;
  canViewSessions: boolean;
  unreadCounts: any = {};
  adminUnread: number;

  links = [
    { text: 'Home', path: '/app/announcements', icon: 'home' },
    { text: 'Member Content', path: '/app/member-content', icon: 'subscriptions' },
    { text: 'Directory', path: '/app/directory', icon: 'search' },
    { text: 'Newsfeed', path: '/app/newsfeed', icon: 'chat_bubble' },
    { text: 'My Sessions', path: '/app/my-sessions', icon: 'audiotrack', hasPermissions: () => this.canViewSessions },
    { text: 'Events', path: 'https://www.helpingmusic.org/events-page/?view=calendar', icon: 'event', external: true },
    { text: 'Discounts', path: '/app/discounts', icon: 'store' },
  ];

  constructor(
    private auth: AuthService,
    private modal: ModalService,
    private notificationService: NotificationService,
    private nav: NavService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.user = u;
        this.isAdmin = (u.role === 'admin');
        this.canViewSessions = this.auth.hasTier([
          'pro', 'community', 'online',
          MembershipTiers.COMMUNITY,
          MembershipTiers.CREATIVE,
          MembershipTiers.COWRITE,
          MembershipTiers.COWORK,
          MembershipTiers.PRODUCTION,
        ]);
      });

    this.notificationService.unread
      .subscribe(counts => {
        this.unreadCounts = counts;
        this.adminUnread = 0;
        for (const t in counts) {
          if (!counts.hasOwnProperty(t)) continue;
          this.adminUnread += counts[t];
        }
      });
  }

  async navigate(path) {
    this.nav.isMobile$
      .pipe(take(1))
      .subscribe(is => {
        if (is) this.nav.toggleNav(NavType.LEFT, false);
      });

    await this.router.navigateByUrl(path);
  }

  referralInfo() {
    let html;
    if (this.user.isActive) {
      html = `
        <p>Love H.O.M.E. and want to share it? Look no further!</p>
        <p>Give your friends your referral code to sign up, and you both will receive an extra free month of a H.O.M.E. subscription.</p>
        <p>Your code is <b>${this.user.referralCode}</b>.</p>
      `;
    } else {
      html = `
        <p>
        It looks like your profile is not active. To refer friends to H.O.M.E., 
        you need an active account. Go to your member settings to update your subscription and profile.
        </p>
      `;
    }

    this.modal.popup({
      title: 'Refer a Friend',
      html: html,
      showCancelButton: false,
      confirmButtonText: 'Okay',
    });
  }

}
