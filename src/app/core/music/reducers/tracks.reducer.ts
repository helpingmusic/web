import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Song } from 'models/song';
import * as moment from 'moment';
import { TracksActions, TracksActionTypes } from '../actions/tracks.actions';

export interface State extends EntityState<Song> {
  playing: boolean;
  loading: boolean;
  currentTrack: string,
}

export const adapter: EntityAdapter<Song> = createEntityAdapter<Song>({
  selectId: (a: Song) => a._id,
  sortComparer(a: Song, b: Song): number {
    return moment(b.created_at).unix() - moment(a.created_at).unix();
  },
});

export const initialState: State = adapter.getInitialState({
  playing: false,
  loading: false,
  currentTrack: null,
});

const { selectAll, selectEntities } = adapter.getSelectors();
export const selectTracksState = createFeatureSelector<State>('tracks');
export const selectTracks = createSelector(selectTracksState, selectAll);
export const selectTrackEntities = createSelector(selectTracksState, selectEntities);
export const selectTrackById = createSelector(
  selectTrackEntities,
  (tracks: Dictionary<Song>, id: string) => tracks[id],
);
export const selectTracksForUser = createSelector(
  selectTracks,
  (tracks: Song[], userId: string) => tracks.filter(p => p.user._id === userId),
);
export const selectCurrentTrack = createSelector(
  selectTracksState,
  (state: State) => state.entities[state.currentTrack],
);

export function reducer(state = initialState, action: TracksActions): State {
  switch (action.type) {

    case TracksActionTypes.LoadTracks:
      return adapter.upsertMany(action.payload.tracks, state);

    case TracksActionTypes.PlayTrack: {
      if (action.payload.track) {
        return { ...state, currentTrack: action.payload.track, loading: true };
      }
      return state;
    }

    case TracksActionTypes.UpsertTrack:
      return adapter.upsertOne(action.payload, state);

    case TracksActionTypes.UpdateTrack:
      return adapter.updateOne(action.payload, state);

    case TracksActionTypes.DeleteTrack:
      return adapter.removeOne(action.payload.trackId, state);

    case TracksActionTypes.TrackPlaying:
      return { ...state, playing: true, loading: false };

    case TracksActionTypes.TrackPaused:
      return { ...state, playing: false, loading: false };

    case TracksActionTypes.TrackFinished:
      return { ...state, playing: false, loading: false };

    default:
      return state;
  }
}
