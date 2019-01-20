import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';

import { AuthService } from 'app/core/auth/auth.service';
import { NotificationService } from 'app/core/notification.service';
import { Announcement } from 'models/announcement';

import { Observable } from 'rxjs';
import { first, tap } from 'rxjs/operators';

import { AnnouncementService } from './announcement.service';

@Component({
  selector: 'home-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss'],
})
export class AnnouncementsComponent implements OnInit {

  announcementsLoading: boolean;
  isAdmin: boolean;

  announcements$: Observable<Array<Announcement>>;

  constructor(
    private auth: AuthService,
    public announcementService: AnnouncementService,
    private modal: MatDialog,
    private notificationService: NotificationService
  ) {
    this.announcementsLoading = true;
  }

  ngOnInit() {
    this.isAdmin = this.auth.hasRole('admin');

    this.announcements$ = this.announcementService.index().pipe(
      tap(() => this.announcementsLoading = false),
    );

    this.notificationService.notifications$.pipe(
      first())
      .subscribe(() => this.notificationService.markRead('announcement'));
  }

  onScroll() {
    this.announcementService.nextPage();
  }

}
