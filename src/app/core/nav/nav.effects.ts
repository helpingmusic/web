import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NavActionTypes, ToggleNav } from 'app/core/nav/actions/nav.actions';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable()
export class NavEffects {

  constructor(
    private actions$: Actions,
    private router: Router,
  ) {
  }


  @Effect({ dispatch: false })
  navigateRightNav$ = this.actions$.pipe(
    ofType(NavActionTypes.ToggleNav),
    filter((a: ToggleNav) => !a.payload.open),
    mergeMap(async (action: ToggleNav) =>
      this.router.navigate(['app', { outlets: { s: null } }], {
        replaceUrl: true,
        skipLocationChange: true,
      }),
    ),
  );

}
