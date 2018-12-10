import { filter } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

import { User } from 'models/user';
import { NotificationService } from 'app/core/notification.service';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { IssueService } from 'app/core/issue.service';
import { Issue } from 'models/issue';

@Component({
  selector: 'home-head-nav',
  templateUrl: './head-nav.component.html',
  styleUrls: ['./head-nav.component.scss']
})
export class HeadNavComponent implements OnInit, AfterViewInit {

  user: User;
  unreadCount = 0;
  notificationsTarget = ['notifications', 'unread'];
  showSearchBar: boolean;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private auth: AuthService,
    private issueService: IssueService,
    private modal: ModalService
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => this.user = u);

    this.notificationService.unread
      .subscribe(counts => {
        let total = 0;
        for (const k in counts) total += counts[k];
        this.unreadCount = total;
      });
    this.notificationService.notifications$
      .subscribe(() => {
      });
    this.notificationService.query({});

    // Make sure the notifications tag toggles
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart))
      .subscribe((event) => {
        // Cheap way to check if sidebar is open
        const next = ~(<NavigationStart>event).url.indexOf('//s:');
        this.notificationsTarget = next ? null : ['notifications', 'unread'];
      });
  }

  ngAfterViewInit() {
    $.material.init('home-head-nav');
  }

  toggleSidebar() {
    // todo toggle leftbar
  }

  openNotifications() {
    this.router.navigate(['app', {outlets: {s: this.notificationsTarget}}]);
  }

  isMobile() {
    return window.innerWidth < 768;
  }


  report(type: string) {
    let title;
    switch (type) {
      case 'bug':
        title = 'Report a Bug';
        break;
      case 'suggestion':
        title = 'Send a Suggestion';
        break;
    }

    this.modal.popup({
      title,
      text: 'Let us know what we can work on.',
      input: 'textarea',
      confirmButtonText: 'Send',
    })
      .then(description => {
        if (!description) return false;

        const iss = new Issue({ type, description });

        this.issueService.save(iss)
          .subscribe(
            i => {
              this.modal.popup({
                type: 'success',
                title: 'Success',
                text: `We'll get on it! Thank you for making H.O.M.E. a better community.`,
                showCancelButton: false,
              });
            },
            e => {
              this.modal.popup({
                type: 'error',
                title: 'Something went wrong',
                text: 'Please try again later.',
                showCancelButton: false,
              });
            }
          );
      })
      .catch(() => {
      });
  }

}
