import { MediaMatcher } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToggleNav } from 'app/core/nav/actions/nav.actions';
import { NavType } from 'app/core/nav/nav-type.enum';
import { BehaviorSubject, Observable } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { selectNavStatus } from './reducers/nav.reducer';
import * as fromNav from './reducers/nav.reducer';

@Injectable()
export class NavService {
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: (event: any) => void;

  private _isMobile$ = new BehaviorSubject<boolean>(false);
  isMobile$ = this._isMobile$.asObservable();

  constructor(
    media: MediaMatcher,
    private store: Store<fromNav.State>
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = (event) => this._isMobile$.next(event.matches);
    this.mobileQuery.addListener(this._mobileQueryListener);
    this._isMobile$.next(this.mobileQuery.matches);

    this.isMobile$.subscribe(is => {
      this.toggleNav(NavType.LEFT, !is);
      this.toggleNav(NavType.SEARCH_BAR, !is);
    });
  }

  toggleNav(nav: NavType, open?: boolean) {
    this.store.dispatch(new ToggleNav({ nav, open }));
  }

  getNavStatus(nav: NavType): Observable<boolean> {
    return this.store.select(selectNavStatus, nav);
  }

}
