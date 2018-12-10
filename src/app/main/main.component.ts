import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from 'app/core/music/player.service';

@Component({
  selector: 'home-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  playerShowing = false;

  constructor(private player: PlayerService) {
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.player.pause();
    // this.playerShowing = false;
  }

}
