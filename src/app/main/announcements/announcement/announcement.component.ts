import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ModalService } from 'app/core/modal.service';
import { DeleteAnnouncementModalComponent } from 'app/main/announcements/delete-announcement-modal.component';
import { EditAnnouncementModalComponent } from 'app/main/announcements/edit-announcement-modal/edit-announcement-modal.component';

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
  @Input() announcement: Announcement;

  userRole: string;
  postedAt: string;

  constructor(
    private auth: AuthService,
    private modal: MatDialog,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe((u: User) => {
        this.userRole = u.role;
      });

    this.postedAt = moment(this.announcement.created_at).fromNow();
  }

  edit() {
    const dialogRef = this.modal.open(EditAnnouncementModalComponent, {
      width: '400px',
      data: { announcement: this.announcement },
    });

    dialogRef.beforeClosed()
      .subscribe(() => {});
  }


  delete() {
    const dialogRef = this.modal.open(DeleteAnnouncementModalComponent, {
      width: '400px',
      data: { announcement: this.announcement },
    });

    dialogRef.beforeClosed()
      .pipe(filter(removed => !!removed))
      .subscribe(() => {
        this.snackbar.open('Announcement Has Been Removed', null, {
          duration: 2000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      });
  }

}
