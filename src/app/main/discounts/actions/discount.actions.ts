import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Discount } from 'models/discount';

export enum DiscountActionTypes {
  EditDiscount = '[Discount] Edit Discount',
  CreateDiscount = '[Discount] Create Discount',
  DeleteDiscount = '[Discount] Delete Discount',
  UpsertDiscount = '[Discount] Upsert Discount',
  DiscountsLoaded = '[Discount] Discounts Loaded',
}

export class CreateDiscount implements Action {
  readonly type = DiscountActionTypes.CreateDiscount;
  constructor(public payload: Partial<Discount>) { }
}

export class EditDiscount implements Action {
  readonly type = DiscountActionTypes.EditDiscount;
  constructor(public payload: Update<Discount>) { }
}

export class DeleteDiscount implements Action {
  readonly type = DiscountActionTypes.DeleteDiscount;
  constructor(public payload: { id: string }) {}
}

export class DiscountsLoaded implements Action {
  readonly type = DiscountActionTypes.DiscountsLoaded;
  constructor(public payload: { discounts: Discount[] }) { }
}

export class UpsertDiscount implements Action {
  readonly type = DiscountActionTypes.UpsertDiscount;
  constructor(public payload: Discount) { }
}


export type DiscountActions = DiscountsLoaded
  | UpsertDiscount
  | EditDiscount
  | CreateDiscount
  | DeleteDiscount;
