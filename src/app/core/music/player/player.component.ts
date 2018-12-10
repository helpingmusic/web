import { Component, EventEmitter, OnInit, Output, } from '@angular/core';
import { TrackService } from 'app/core/music/track.service';
import { PlayerService } from '../player.service';

@Component({
  selector: 'home-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  visible = false;

  @Output() toggle = new EventEmitter<boolean>();

  constructor(
    public player: PlayerService,
    private trackService: TrackService,
  ) {
  }

  ngOnInit() {
  }

  show() {
    this.visible = true;
    this.toggle.emit(this.visible);
  }

  hide() {
    this.visible = false;
    this.toggle.emit(this.visible);
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
