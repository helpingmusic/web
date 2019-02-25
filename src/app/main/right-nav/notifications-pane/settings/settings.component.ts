import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/notification.service';
import { User } from 'models/user';

@Component({
  selector: 'home-notification-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  currentUser: User;

  browserEnabled: boolean;
  browserAllEnabled: boolean;
  emailEnabled: boolean;
  emailAllEnabled: boolean;

  settings = [
    {
      title: 'Account',
      description: 'Get important updates related to your H.O.M.E. account',
      key: 'account'
    },
    {
      title: 'Discounts',
      description: 'Get updated H.O.M.E. member discounts around town.',
      key: 'discount'
    },
    {
      title: 'Announcements',
      description: 'Get H.O.M.E. community announcements.',
      key: 'announcement'
    },
    {
      title: 'Reviews',
      description: 'Get notified when a member leaves a review on your profile.',
      key: 'review'
    },
  ];

  constructor(
    public notificationService: NotificationService,
    private router: Router,
    private auth: AuthService,
  ) {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.currentUser = u;

        const notifyTypes = Object.keys(this.currentUser.notifications);

        // Set booleans needed for the check inputs
        // to show the status of All notifications for browser of email
        this.browserEnabled = notifyTypes.some(k => u.notifications[k]['browser']);
        this.browserAllEnabled = notifyTypes.every(k => u.notifications[k]['browser']);
        this.emailEnabled = notifyTypes.some(k => u.notifications[k]['email']);
        this.emailAllEnabled = notifyTypes.every(k => u.notifications[k]['email']);
      });
  }


  ngOnInit() {

  }

  setAllNotifications(medium, enabled) {
    Object.keys(this.currentUser.notifications)
      .map(k => this.currentUser.notifications[k][medium] = enabled);
    this.updateUserNotifications();
  }

  updateUserNotifications() {
    this.auth.updateNotificationSettings(this.currentUser.notifications)
      .subscribe();
  }

}
