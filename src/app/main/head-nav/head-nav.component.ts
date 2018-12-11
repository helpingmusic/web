import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { IssueService } from 'app/core/issue.service';
import { ModalService } from 'app/core/modal.service';
import { NavType } from 'app/core/nav/nav-type.enum';
import { NavService } from 'app/core/nav/nav.service';
import { NotificationService } from 'app/core/notification.service';
import { Issue } from 'models/issue';

import { User } from 'models/user';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'home-head-nav',
  templateUrl: './head-nav.component.html',
  styleUrls: ['./head-nav.component.scss']
})
export class HeadNavComponent implements OnInit {

  user: User;
  unreadCount = 0;
  notificationsTarget = ['notifications', 'unread'];
  showSearchBar$: Observable<boolean>;

  constructor(
    private notificationService: NotificationService,
    private router: Router,
    private auth: AuthService,
    private issueService: IssueService,
    private modal: ModalService,
    public navService: NavService,
  ) {
    this.showSearchBar$ = this.navService.getNavStatus(NavType.SEARCH_BAR);
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

    this.notificationService.notifications$.subscribe();
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

  toggleLeftbar() {
    this.navService.toggleNav(NavType.LEFT);
  }
  toggleSearch() {
    this.navService.toggleNav(NavType.SEARCH_BAR);
  }

  openNotifications() {
    this.router.navigate(['app', { outlets: { s: this.notificationsTarget } }], {
      replaceUrl: true,
      skipLocationChange: true,
    });
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
