import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlayerService } from 'app/core/music/player.service';
import { NavType } from 'app/core/nav/nav-type.enum';
import { NavService } from 'app/core/nav/nav.service';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'home-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {

  showLeftNav$: Observable<boolean>;
  showRightNav$: Observable<boolean>;
  showPlayer$: Observable<boolean>;

  constructor(
    private player: PlayerService,
    private navService: NavService,
  ) {
    this.showLeftNav$ = this.navService.getNavStatus(NavType.LEFT);
    this.showRightNav$ = this.navService.getNavStatus(NavType.RIGHT);
    this.showPlayer$ = this.navService.getNavStatus(NavType.PLAYER);
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.player.pause();
    // this.playerShowing = false;
  }

  closeNav() {
    this.navService.toggleNav(NavType.RIGHT, false);

    this.navService.isMobile$
      .pipe(take(1))
      .subscribe(is => {
        if (is) this.navService.toggleNav(NavType.LEFT, false);
      });
  }

}
