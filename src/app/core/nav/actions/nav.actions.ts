import { Action } from '@ngrx/store';
import { NavType } from 'app/core/nav/nav-type.enum';

export enum NavActionTypes {
  ToggleNav = '[Nav] Toggle Nav'
}

export class ToggleNav implements Action {
  readonly type = NavActionTypes.ToggleNav;
  constructor(public payload: { nav: NavType, open?: boolean }) { }
}

export type NavActions = ToggleNav;
