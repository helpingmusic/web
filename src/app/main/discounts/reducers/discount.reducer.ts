import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Discount } from 'models/discount';
import * as moment from 'moment';
import { DiscountActions, DiscountActionTypes } from '../actions/discount.actions';

export interface State extends EntityState<Discount> {
}

export const adapter: EntityAdapter<Discount> = createEntityAdapter<Discount>({
  selectId: (a: Discount) => a._id,
  sortComparer(a: Discount, b: Discount): number {
    return moment(b.created_at).unix() - moment(a.created_at).unix();
  },
});

export const initialState: State = adapter.getInitialState({});


const { selectAll } = adapter.getSelectors();
export const selectDiscountsState = createFeatureSelector<State>('discounts');
export const selectDiscounts = createSelector(selectDiscountsState, selectAll);

export function reducer(state = initialState, action: DiscountActions): State {
  switch (action.type) {

    case DiscountActionTypes.DiscountsLoaded:
      return adapter.upsertMany(action.payload.discounts, state);

    case DiscountActionTypes.UpsertDiscount:
      return adapter.upsertOne(action.payload, state);

    case DiscountActionTypes.EditDiscount:
      return adapter.updateOne(action.payload, state);

    case DiscountActionTypes.DeleteDiscount:
      return adapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
