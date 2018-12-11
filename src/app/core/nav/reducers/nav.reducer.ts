import { Action, createSelector } from '@ngrx/store';
import { NavType } from 'app/core/nav/nav-type.enum';
import { NavActions, NavActionTypes } from '../actions/nav.actions';

export interface State {
  [NavType.RIGHT]: boolean;
  [NavType.LEFT]: boolean;
  [NavType.PLAYER]: boolean;
  [NavType.SEARCH_BAR]: boolean;
}

export const initialState: State = {
  [NavType.RIGHT]: false,
  [NavType.LEFT]: true,
  [NavType.SEARCH_BAR]: false,
  [NavType.PLAYER]: false,
};

export const selectNavState = (state: any) => state.nav;
export const selectNavStatus = createSelector(
  selectNavState,
  (state: State, nav: NavType) => state[nav],
);

export function reducer(state = initialState, action: NavActions): State {
  switch (action.type) {

    case NavActionTypes.ToggleNav:
      const p = action.payload;
      // use passed open option or default to opposite of current state
      const open = p.open !== undefined ? p.open : !state[p.nav];
      return { ...state, [p.nav]: open };

    default:
      return state;
  }
}
