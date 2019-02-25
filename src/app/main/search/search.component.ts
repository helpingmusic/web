import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';
import { catchError, debounceTime, distinctUntilChanged, map, share, switchMap, switchMapTo, tap, throttleTime } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BehaviorSubject, Observable, Subject } from 'rxjs';


import { membershipTypes } from 'app/globals';
import { User } from 'models/user';
import { UserService } from 'app/core/user/user.service';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'home-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {

  search$ = new Subject<any>();
  results$: Observable<any>;
  users$: Observable<Array<User[]>>;

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  offset = new BehaviorSubject(null);

  focused: boolean; // is input focused
  membershipTypes: any = membershipTypes;
  filters: any = {
    membership_types: {}
  };
  query: string;
  advanced: boolean;
  done: boolean;

  get isMobile() {
    return window.innerWidth < 768;
  }
  get itemSize() {
    return 372;
  }

  constructor(
    private activeRoute: ActivatedRoute,
    public userService: UserService,
    private modal: ModalService,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.users$ = this.offset.pipe(
      // distinctUntilChanged(),
      throttleTime(500),
      tap(() => this.userService.nextSearchPage()),
      switchMapTo(this.userService.collection$),
      // chunk array for rows
      map(users => {
        const perRow = this.isMobile ? 1 : 3;
        const tmp = [...users];
        return Array(Math.ceil(users.length / perRow)).fill(0)
          .map(() => tmp.splice(0, perRow));
      }),
      // share(),
    );

    // Search stream
    this.results$ = this.activeRoute.queryParams.pipe(
      debounceTime(500),
      map(params => {

        const query = params.q;

        const filters = {
          ...this.filters,
          state: params.geo || this.filters.state,
          membership_types: params.t ? params.t.split('-') : [],
          typesAnd: params.ta === '1',
        };

        return { query };
      }),
      switchMap(q => this.userService.search(q)),
      catchError(err => {
        this.modal.error();
        console.log(err);
        return [];
      }),
      share(),);

    // default checkboxes to all selected
    this.membershipTypes.forEach(t => {
      this.filters.membership_types[t.name] = true;
    });
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.search$.unsubscribe();
  }

  nextBatch(offset) {
    if (this.done) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();

    if (end === total) {
      this.offset.next(offset);
    }
  }

  doSearch() {
    console.log('do search');
    const list = [];
    if (this.filters.state && this.filters.state !== 'all') {
      list.push(`state:"${this.filters.state}" `);
    }

    const types = Object.keys(this.filters.membership_types)
      .filter(t => this.filters.membership_types[t])
      .map(t => `membership_types:"${t}"`)
      .join(this.filters.typesAnd ? ' AND ' : ' OR ');

    if (types) list.push(`(${types})`);

    const query = {
      query: this.query || '',
      filters: list.join(' AND '),
    };

    this.saveSearch();
    // If no state, search all

    this.search$.next(query);
  }

  // Save search query to the route query params
  saveSearch() {

    return this.router.navigate(['/directory'], {
      'queryParams': {
        q: this.query,
        t: this.filters.membership_types.join('-'),
        ta: this.filters.typesAnd ? 1 : 0,
        geo: this.filters.state,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
      skipLocationChange: true,
    });
  }

  animate() {
    setTimeout(() => {

    }, 100);
  }

  clear(i) {
    if (window.innerWidth > 992) return i % 3 === 0;
    return i % 2 === 0;
  }

  trackByIndex(index, user) {
    return index;
  }

}
