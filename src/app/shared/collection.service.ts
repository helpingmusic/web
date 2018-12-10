import { filter, map, share, tap } from 'rxjs/operators';
import { Response } from '@angular/http';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BehaviorSubject, Observable } from 'rxjs';

import { Doc } from 'models/doc';


/**
 *  Collection service
 *
 *  Interfaces with a REST api
 */

export class CollectionService<T extends Doc> {
  protected endpoint = '';
  protected populated: boolean; // used to filter out initial value of BehaviorSubject
  private mergeResults: boolean; // to replace collection or to merge together

  protected _loading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public readonly loading$: Observable<boolean> = this._loading.asObservable();

  // pagination
  protected lastQuery: HttpParams;
  protected curPage = 0;
  protected hasNext = true; // has next pagination

  protected _collection: BehaviorSubject<Array<T>> = new BehaviorSubject([]);
  public readonly collection$: Observable<Array<T>> = this._collection.asObservable().pipe(
    filter(() => this.populated),
    // .distinctUntilChanged(null, c => c.map(i => i.updated_at).join())
    share(),);

  constructor(protected http: HttpClient) {
  }

  /**
   *  Get all collection
   *  @param {object} q - Query
   *  @param {boolean} save - Whether or not to save the returning data
   *  @return {Observable<Array<T>>}
   */
  query(q: object = {}): Observable<Array<T>> {
    this._loading.next(true);

    let params = new HttpParams();
    Object.keys(q).forEach(k => {
      const body = (q[k] instanceof Object) ? JSON.stringify(q[k]) : q[k];
      if (!body) return;
      params = params.set(k, body);
    });

    this.lastQuery = params;
    this.curPage = 0;
    this.hasNext = true;

    this.http.get<Array<T>>(this.endpoint, { params })
      .subscribe(d => {
        this.populated = true;
        let col = d;
        if (this.mergeResults) {
          col = this.arrayUnique(d.concat(this._collection.getValue()));
        }
        this._collection.next(col);
        this._loading.next(false);
      });

    return this.collection$;
  }

  nextPage(): boolean {
    if (!this.hasNext) return this.hasNext;
    this._loading.next(true);

    if (!this.curPage) this.curPage = 0;
    const params = this.lastQuery.set('page', String(++this.curPage));

    this.http.get<Array<T>>(this.endpoint, { params })
      .subscribe(col => {
        const old = this._collection.getValue();
        const next = this.arrayUnique(old.concat(col));

        this.hasNext = old.length !== next.length;

        this._collection.next(next);
        this._loading.next(false);
      });

    return this.hasNext;
  }

  getById(id: string): Observable<T> {
    this._loading.next(true);
    return this.http.get<T>(`${this.endpoint}/${id}`).pipe(
      tap(() => this._loading.next(false)));
  }

  /**
   *  Save a Doc
   *  Makes a put request if already exists,
   *    Or makes post request if need to create
   *  @param  {T}             Doc to Save
   *  @return {Observable<T>}
   */
  save(document: T): Observable<T> {
    this._loading.next(true);

    const req$ = (document._id) ?
      this.http.put<T>(`${this.endpoint}/${document._id}`, document)
      : this.http.post<T>(this.endpoint, document);

    const action$ = req$.pipe(share());

    action$.subscribe((doc: T) => {
      const collection = this._collection.getValue();
      console.log(doc);
      console.log(collection);
      const idx = collection.findIndex(d => d._id === doc._id);
      console.log(idx);

      (idx === -1) ? collection.unshift(doc) : collection[idx] = doc;
      this._collection.next(collection);
      this._loading.next(false);
    });

    return action$;
  }

  /**
   *  Delete T
   *  @param  {T} Doc to delete
   *  @return {Observable<Response>}
   */
  delete(doc: T): Observable<any> {
    this._loading.next(true);
    return this.http.delete(`${this.endpoint}/${doc._id}`).pipe(
      map(() => {
        const collection = this._collection.getValue()
          .filter(p => p._id !== doc._id);
        this._collection.next(collection);
        this._loading.next(false);
      }));
  }

  protected arrayUnique(arr: Array<T>): Array<T> {
    const a = arr.concat();
    for (let i = 0; i < a.length; ++i) {
      for (let j = i + 1; j < a.length; ++j) {
        if (a[i]._id === a[j]._id) a.splice(j--, 1);
      }
    }
    return a;
  }

}
