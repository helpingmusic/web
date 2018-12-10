import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/notification.service';
import { Notification } from 'models/notification';
import { User } from 'models/user';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'home-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notifications$: Observable<Array<Notification>>;
  unreadCount = 0;
  currentUser: User;

  scrollEl: any;
  moreNotifications = true;

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
  ) {
  }

  sanitize(str) {
    return this.sanitizer.bypassSecurityTrustUrl(str);
  }

  ngOnInit() {
    $.material.init();

    this.notificationService.unread
      .subscribe(counts => {
        this.unreadCount = Object.keys(counts)
          .reduce((sum, k) => sum + counts[k], 0);
      });

    this.notifications$ = this.notificationService.notifications$;
    this.notificationService.query({});
  }

  onScroll() {
    this.moreNotifications = this.notificationService.nextPage();
  }

  openNotification(n: Notification) {
    this.notificationService.markRead(n);
    this.router.navigateByUrl(n.link);
  }
}
