import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TrackService } from 'app/core/music/track.service';
import { Song } from 'models/song';

@Component({
  selector: 'home-delete-track-modal',
  template: `
    <h2 mat-dialog-title>Delete Track</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to remove the track
        <b>{{ data.track.title }}</b>?
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
export class DeleteTrackModalComponent implements OnInit {

  constructor(
    private ref: MatDialogRef<DeleteTrackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { track: Song },
    private trackService: TrackService,
  ) {
  }

  ngOnInit() {
  }

  remove() {
    this.trackService.delete(this.data.track._id);
    this.ref.close(true);
  }

}
