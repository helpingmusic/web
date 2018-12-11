import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarRef } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PlayerService } from 'app/core/music/player.service';
import { PlayerComponent } from 'app/core/music/player/player.component';
import { ToastService } from 'app/core/toast.service';
import { Song } from 'models/song';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  CreateTrack,
  DeleteTrack,
  FetchTracksForUser,
  LoadTracks,
  PlayTrack,
  TracksActionTypes,
  UpdateTrack,
  UpsertTrack
} from '../actions/tracks.actions';

@Injectable()
export class TracksEffects {

  endpoint = '/songs';
  playerRef: MatSnackBarRef<PlayerComponent>;

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private player: PlayerService,
    private snack: MatSnackBar,
  ) {
  }

  @Effect()
  loadForUser$ = this.actions$.pipe(
    ofType(TracksActionTypes.FetchTracksForUser),
    mergeMap((action: FetchTracksForUser) =>
      this.http.get<Song[]>(this.endpoint, { params: { user: action.payload.userId } }).pipe(
        map(tracks => new LoadTracks({ tracks })),
      )
    )
  );


  @Effect()
  create$ = this.actions$.pipe(
    ofType(TracksActionTypes.CreateTrack),
    tap((action: CreateTrack) => {
     this.snack.open(`Track "${action.payload.track.get('title')}" is being uploaded. This may take a moment.`, null, {
       verticalPosition: 'top',
       horizontalPosition: 'end',
       duration: 5000,
     })
    }),
    mergeMap((action: CreateTrack) =>
      this.http.post<Song>(this.endpoint, action.payload.track).pipe(
        map(track => new UpsertTrack(track)),
        tap((action: UpsertTrack) => {
          this.snack.open(`Track "${action.payload.title}" has been uploaded!`, null, {
            verticalPosition: 'top',
            horizontalPosition: 'end',
            duration: 5000,
          })
        }),
      )
    ),
  );

  @Effect()
  update$ = this.actions$.pipe(
    ofType(TracksActionTypes.UpdateTrack),
    mergeMap((action: UpdateTrack) =>
      this.http.put<Song>(`${this.endpoint}/${action.payload.id}`, action.payload.changes).pipe(
        map(track => new UpsertTrack(track))
      )
    ),
  );

  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(TracksActionTypes.DeleteTrack),
    mergeMap((action: DeleteTrack) =>
      this.http.delete<Song>(`${this.endpoint}/${action.payload.trackId}`)
    ),
  );

  /**
   * Playing audio
   */

  @Effect({ dispatch: false })
  play$ = this.actions$.pipe(
    ofType(TracksActionTypes.PlayTrack),
    map((action: PlayTrack) => this.player.play(action.payload.track)),
  );

  @Effect({ dispatch: false })
  pause$ = this.actions$.pipe(
    ofType(TracksActionTypes.PauseTrack),
    map(() => this.player.pause()),
  );

  @Effect({ dispatch: false })
  openPlayer$ = this.actions$.pipe(
    ofType(TracksActionTypes.PlayTrack),
    map((action: PlayTrack) => {
      if (this.playerRef) return;

      this.playerRef = this.snack.openFromComponent(PlayerComponent, {
        verticalPosition: 'bottom',
        horizontalPosition: 'right',
        panelClass: 'snack-music-player',
      });
    }),
  );

}
