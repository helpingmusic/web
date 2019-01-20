import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Announcement } from 'models/announcement';
import * as moment from 'moment';
import { AnnouncementActions, AnnouncementActionTypes } from '../actions/announcement.actions';

export interface State extends EntityState<Announcement> {
  page: number;
}

export const adapter: EntityAdapter<Announcement> = createEntityAdapter<Announcement>({
  selectId: (a: any) => a.id,
  sortComparer(a: any, b: any): number {
    const date = d => d.data.originally_published || d.first_published_date;
    return moment(date(b)).unix() - moment(date(a)).unix();
  },
});

export const initialState: State = adapter.getInitialState({
  page: 0,
});


const { selectAll } = adapter.getSelectors();
export const selectAnnouncementsState = createFeatureSelector<State>('announcements');
export const selectAnnouncements = createSelector(selectAnnouncementsState, selectAll);
export const getAnnouncementsPage = createSelector(
  selectAnnouncementsState,
  (s: State) => s.page,
);


export function reducer(state = initialState, action: AnnouncementActions): State {
  switch (action.type) {

    case AnnouncementActionTypes.AnnouncementsLoaded:
      return adapter.upsertMany(action.payload.announcements, state);

    default:
      return state;
  }
}
