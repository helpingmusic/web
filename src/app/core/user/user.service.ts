import { from as observableFrom, Observable } from 'rxjs';

import { map, share, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as algoliasearch from 'algoliasearch';

import { algolia } from 'app/globals';
import { CollectionService } from 'app/shared/collection.service';
import { User } from 'models/user';
import { BookCycle } from 'models/book-cycle';


@Injectable()
export class UserService extends CollectionService<User> {

  index: any;
  lastIndexQuery: any = {};

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/users';

    const client = algoliasearch(algolia.appId, algolia.apiKey);
    this.index = client.initIndex('members');
  }

  search(q: any = {}): Observable<any> {
    this.lastIndexQuery = q;
    this.curPage = 0;

    this._loading.next(true);

    const search$ = observableFrom(
      this.index.search(q)
    ).pipe(
      tap((res: any) => {
        this.populated = true;
        this.hasNext = res.page < res.nbPages;
      }),
      share(),
    );

    search$.pipe(
      map((res: any) => res.hits))
      .subscribe(u => {
        this._collection.next(u);
        this._loading.next(false);
      });

    return search$;
  }

  nextSearchPage(): void {
    if (!this.hasNext) return;
    this._loading.next(true);

    const q = this.lastIndexQuery;
    q.page = ++this.curPage;

    this.index.search(q)
      .then(res => {
        const old = this._collection.getValue();
        const next = this.arrayUnique(old.concat(res.hits));

        this.hasNext = res.page < res.nbPages;

        this._collection.next(next);
        this._loading.next(false);
      });
  }

  getCurrentBookCycles(userId: string = 'me'): Observable<Array<BookCycle>> {
    return this.http.get<Array<BookCycle>>(`${this.endpoint}/${userId}/bookCycles`)
      .pipe(
        map(cycles => cycles.map(c => new BookCycle(c)))
      );
  }
}
