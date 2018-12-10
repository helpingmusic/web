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
    $.material.init('home-notification-settings');
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
