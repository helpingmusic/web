import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AnnouncementService } from 'app/main/announcements/announcement.service';
import { Announcement } from 'models/announcement';

@Component({
  selector: 'home-delete-announcement-modal',
  template: `
    <h2 mat-dialog-title>Delete Announcement</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to remove the announcement
        <b>{{ data.announcement.title }}</b>?
      </p>
      <p>
        This action cannot be undone.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      
      <button (click)="remove()" class="btn-danger" mat-button type="submit">Remove</button>
    </mat-dialog-actions>

  `,
  styles: []
})
export class DeleteAnnouncementModalComponent implements OnInit {

  constructor(
    private ref: MatDialogRef<DeleteAnnouncementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcement: Announcement },
    private announcementService: AnnouncementService,
  ) {
  }

  ngOnInit() {
  }

  remove() {
    this.announcementService.delete(this.data.announcement._id);
    this.ref.close(true);
  }

}
