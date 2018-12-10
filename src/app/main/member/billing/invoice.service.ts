import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Invoice } from 'models/invoice';

@Injectable()
export class InvoiceService {
  invoices$ = new BehaviorSubject<Array<Invoice>>([]);
  _invoices$ = this.invoices$.asObservable();

  isLoading$ = new BehaviorSubject<boolean>(false);
  _isLoading$ = this.isLoading$.asObservable();

  currentPage = 0;

  constructor(
    private http: HttpClient,
  ) {
  }

  list(): Observable<Array<Invoice>> {
    this.isLoading$.next(true);

    let params = new HttpParams();
    params.append('page', String(this.currentPage));

    this.http.get<Array<Invoice>>('/users/me/subscription/invoices', { params })
      .subscribe(invoices => {
        this.isLoading$.next(false);
        this.invoices$.next([].concat(this.invoices$.getValue(), invoices));
      })

    return this._invoices$;
  }

  nextPage() {
    this.currentPage++;
    this.list();
  }

  clear() {
    this.currentPage = 0;
    this.invoices$.next([]);
  }

}
