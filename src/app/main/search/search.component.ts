import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { catchError, debounceTime, distinctUntilChanged, map, share, switchMap, tap } from 'rxjs/operators';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';


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
  users$: Observable<Array<User>>;

  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  focused: boolean; // is input focused
  membershipTypes: any = membershipTypes;
  filters: any = {
    membership_types: {}
  };
  query: string;
  advanced: boolean;
  done: boolean;


  constructor(
    private activeRoute: ActivatedRoute,
    public userService: UserService,
    private modal: ModalService,
    private router: Router,
  ) {
  }

  ngOnInit() {

    this.users$ = this.userService.collection$.pipe(
      distinctUntilChanged((x, y) => {
        if (x.length !== y.length) return false;
        return x.every((u, i) => u._id === y[i]._id);
      }),
      tap(() => this.animate()),
      share(),);

    // Search stream
    this.results$ = this.activeRoute.queryParams.pipe(
      debounceTime(500),
      distinctUntilChanged(),
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
    // this.doSearch();
  }

  ngOnDestroy() {
    this.search$.unsubscribe();
  }

  onScroll() {
    this.userService.nextSearchPage();
  }

  nextBatch(e, offset) {
    if (this.done) {
      return;
    }

    const end = this.viewport.getRenderedRange().end;
    const total = this.viewport.getDataLength();
    console.log(`${end}, '>=', ${total}`);
    if (end === total) {
      this.userService.nextSearchPage();
    }
  }

  // format query for mongoose
  doSearch() {
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
      $.material.init('home-search *');
    }, 100);
  }

  clear(i) {
    if (window.innerWidth > 992) return i % 3 === 0;
    return i % 2 === 0;
  }

  trackById(index, user) {
    return user._id;
  }

}
