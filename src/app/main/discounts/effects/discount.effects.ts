import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Discount } from 'models/discount';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  DiscountActionTypes,
  DiscountsLoaded,
  CreateDiscount,
  DeleteDiscount,
  EditDiscount,
  UpsertDiscount
} from '../actions/discount.actions';

@Injectable()
export class DiscountEffects {

  endpoint = '/discounts';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snack: MatSnackBar,
  ) {
  }

  @Effect()
  create$ = this.actions$.pipe(
    ofType(DiscountActionTypes.CreateDiscount),
    mergeMap((action: CreateDiscount) =>
      this.http.post<Discount>(this.endpoint, action.payload).pipe(
        map(discount => new UpsertDiscount(discount)),
        tap(
          () => {},
          err => {
            this.snack.open('Error: Discount Could Not Be Created', null, {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              panelClass: 'snack-error',
              politeness: 'assertive',
              duration: 5000,
            });
          }),
      )
    ),
  );


  @Effect()
  update$ = this.actions$.pipe(
    ofType(DiscountActionTypes.EditDiscount),
    mergeMap((action: EditDiscount) =>
      this.http.put<Discount>(`${this.endpoint}/${action.payload.id}`, action.payload.changes).pipe(
        map(discount => new UpsertDiscount(discount))
      )
    ),
  );

  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(DiscountActionTypes.DeleteDiscount),
    mergeMap((action: DeleteDiscount) =>
      this.http.delete<Discount>(`${this.endpoint}/${action.payload.id}`)
    ),
  );


}
