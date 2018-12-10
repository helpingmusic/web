import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

import { ModalService } from 'app/core/modal.service';
import { AuthService } from 'app/core/auth/auth.service';
import { PlayerService } from 'app/core/music/player.service';
import { DeleteTrackModalComponent } from 'app/main/member/music/delete-track-modal.component';
import { EditTrackModalComponent } from 'app/main/member/music/edit-track-modal/edit-track-modal.component';
import { User } from 'models/user';

import { TrackService } from 'app/core/music/track.service';
import { Song } from 'models/song';

import { Howl } from 'howler';
import { Observable } from 'rxjs';

@Component({
  selector: 'home-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit, OnDestroy {
  member: User = new User();
  loading = false;
  isOwnAccount: boolean;
  errors: any = {};

  tracks$: Observable<Song[]>;

  displayedColumns: string[] = ['play', 'title', 'tags'];

  constructor(
  private trackService: TrackService,
    private auth: AuthService,
    private route: ActivatedRoute,
    private modal: ModalService,
    private player: PlayerService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.route.parent.parent.data
      .subscribe((data: { member: User }) => {
        this.member = data.member;

        this.auth.getCurrentUser()
          .subscribe((u: User) => {
            this.isOwnAccount = (u._id === this.member._id);
            if (this.isOwnAccount) this.displayedColumns.push('controls');
          });

        this.tracks$ = this.trackService.getForUser(this.member._id);
      });

  }

  ngOnDestroy() {
  }

  createTrack() {
    this.dialog.open(EditTrackModalComponent, { width: '400px' });
  }

  edit(track: Song) {
    this.dialog.open(EditTrackModalComponent, {
      width: '400px',
      data: { track },
    })
  }

  remove(track: Song) {
    this.dialog.open(DeleteTrackModalComponent, {
      width: '400px',
      data: { track },
    })

  }

  play(track: Song) {
    this.trackService.play(track._id);
  }

  pause() {
    this.trackService.pause();
  }

}
