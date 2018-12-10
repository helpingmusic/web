import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CreateDiscount, DeleteDiscount, DiscountsLoaded, EditDiscount } from 'app/main/discounts/actions/discount.actions';
import { Discount } from 'models/discount';
import * as fromDiscounts from './reducers/discount.reducer';
import { selectDiscounts } from './reducers/discount.reducer';

@Injectable()
export class DiscountService {

  endpoint = '/discounts';

  constructor(
    private http: HttpClient,
    private store: Store<fromDiscounts.State>
  ) {
  }

  index() {
    this.http.get<Discount[]>(this.endpoint)
      .subscribe(discounts => this.store.dispatch(new DiscountsLoaded({ discounts })));

    return this.store.pipe(select(selectDiscounts));
  }

  create(body: Partial<Discount>) {
    this.store.dispatch(new CreateDiscount(body));
  }

  update(id: string, changes: Partial<Discount>) {
    this.store.dispatch(new EditDiscount({ id, changes }));
  }

  delete(id: string) {
    this.store.dispatch(new DeleteDiscount({ id }));
  }

}
