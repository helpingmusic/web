import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Song } from 'models/song';

export enum TracksActionTypes {
  LoadTracks = '[Tracks] Load Tracks',
  FetchTracksForUser = '[Tracks] Fetch tracks for user',

  PlayTrack = '[Tracks] Play Track',
  PauseTrack = '[Tracks] Pause Track',
  Next = '[Tracks] Next Track',
  Previous = '[Tracks] Previous Track',

  CreateTrack = '[Tracks] Create Track',
  UpdateTrack = '[Tracks] Update Track',
  DeleteTrack = '[Tracks] Delete Track',

  UpsertTrack = '[Tracks] Upsert Track',

  TrackPlaying = '[Tracks] Track Playing',
  TrackPaused = '[Tracks] Track Paused',
  TrackFinished = '[Tracks] Track Finished',
}

export class LoadTracks implements Action {
  readonly type = TracksActionTypes.LoadTracks;
  constructor(public payload: { tracks: Song[] }) {}
}

export class FetchTracksForUser implements Action {
  readonly type = TracksActionTypes.FetchTracksForUser;
  constructor(public payload: { userId: string }) {}
}

export class PlayTrack implements Action {
  readonly type = TracksActionTypes.PlayTrack;
  constructor(public payload: { track?: string }) {}
}

export class PauseTrack implements Action {
  readonly type = TracksActionTypes.PauseTrack;
}

export class TrackFinished implements Action {
  readonly type = TracksActionTypes.TrackFinished;
}
export class TrackPlaying implements Action {
  readonly type = TracksActionTypes.TrackPlaying;
}
export class TrackPaused implements Action {
  readonly type = TracksActionTypes.TrackPaused;
}

export class CreateTrack implements Action {
  readonly type = TracksActionTypes.CreateTrack;
  constructor(public payload: { track: FormData }) {}
}

export class UpdateTrack implements Action {
  readonly type = TracksActionTypes.UpdateTrack;
  constructor(public payload: Update<Song>) {}
}

export class DeleteTrack implements Action {
  readonly type = TracksActionTypes.DeleteTrack;
  constructor(public payload: { trackId: string }) {}
}

export class UpsertTrack implements Action {
  readonly type = TracksActionTypes.UpsertTrack;
  constructor(public payload: Song) {}
}

export type TracksActions = LoadTracks
  | FetchTracksForUser
  | PlayTrack
  | PauseTrack
  | CreateTrack
  | UpdateTrack
  | DeleteTrack
  | UpsertTrack
  | TrackPlaying
  | TrackPaused
  | TrackFinished;
