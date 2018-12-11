import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { NavType } from 'app/core/nav/nav-type.enum';
import { NavService } from 'app/core/nav/nav.service';

@Component({
  selector: 'home-right-nav',
  templateUrl: './right-nav.component.html',
  styleUrls: ['./right-nav.component.scss'],
})
export class RightNavComponent implements OnInit {


  constructor(
    private nav: NavService,
  ) {
  }

  ngOnInit() {
  }

  setSidenavStatus(open: boolean) {
    this.nav.toggleNav(NavType.RIGHT, open);
  }

}
