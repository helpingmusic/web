import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Announcement } from 'models/announcement';
import * as moment from 'moment';
import { AnnouncementActions, AnnouncementActionTypes } from '../actions/announcement.actions';

export interface State extends EntityState<Announcement> {
  page: number;
}

export const adapter: EntityAdapter<Announcement> = createEntityAdapter<Announcement>({
  selectId: (a: Announcement) => a._id,
  sortComparer(a: Announcement, b: Announcement): number {
    return moment(b.created_at).unix() - moment(a.created_at).unix();
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

    case AnnouncementActionTypes.UpsertAnnouncement:
      return adapter.upsertOne(action.payload, state);

    case AnnouncementActionTypes.EditAnnouncement:
      return adapter.updateOne(action.payload, state);

    case AnnouncementActionTypes.FetchAnnouncementsPage:
      return { ...state, page: action.payload.page };

    case AnnouncementActionTypes.DeleteAnnouncement:
      return adapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
