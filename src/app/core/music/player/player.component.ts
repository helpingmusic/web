import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { TrackService } from 'app/core/music/track.service';
import { Song } from 'models/song';
import { combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PlayerService } from '../player.service';

@Component({
  selector: 'home-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  track$: Observable<Song>;

  constructor(
    public player: PlayerService,
    private trackService: TrackService,
  ) {
    this.track$ = this.player.currentTrack$;
  }

  ngOnInit() {
  }

  next() {
    this.player.next();
  }

  prev() {
    this.player.previous();
  }

  pause() {
    this.trackService.pause();
  }

  continueSong() {
    this.trackService.play();
  }

}
