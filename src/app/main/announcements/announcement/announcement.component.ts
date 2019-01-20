import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';

import * as moment from 'moment';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { Announcement } from 'models/announcement';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'home-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})
export class AnnouncementComponent implements OnInit {
  @Input() announcement: any;

  userRole: string;
  postedAt: string;

  constructor(
    private auth: AuthService,
  ) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe((u: User) => {
        this.userRole = u.role;
      });

    const d = this.announcement.data.originally_published || this.announcement.first_publication_date
    this.postedAt = moment(d).fromNow();
  }

}
