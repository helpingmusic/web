import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PlayTrack, TrackFinished, TrackPaused, TrackPlaying } from 'app/core/music/actions/tracks.actions';

import { Howl } from 'howler';

import { Song } from 'models/song';
import { interval as observableInterval, Observable, Subscription } from 'rxjs';

import { first, map, pluck, switchMap, tap } from 'rxjs/operators';
import { selectCurrentTrack, selectTracks, selectTracksState } from './reducers/tracks.reducer';
import * as fromTracks from './reducers/tracks.reducer';
import { TrackService } from './track.service';

@Injectable()
export class PlayerService {

  private audio: any;
  private audio$: Subscription;

  isPlaying$: Observable<boolean>;
  isLoading$: Observable<boolean>;
  currentTrack$: Observable<Song>;

  // Current Second in song
  public readonly currentSeek$ = observableInterval(200)
    .pipe(map(() => this.audio ? this.audio.seek() : 0));

  constructor(
    private songService: TrackService,
    private store: Store<fromTracks.State>,
  ) {
    this.isPlaying$ = this.store.pipe(select(selectTracksState), pluck('playing'));
    this.isLoading$ = this.store.pipe(select(selectTracksState), pluck('loading'));
    this.currentTrack$ = this.store.pipe(select(selectCurrentTrack));
  }

  private jump(n: number) {
    this.store.pipe(
      select(selectTracksState),
      first(),
      map((state: fromTracks.State) => {
        const index = (state.ids as string[]).indexOf(state.currentTrack);
        const next = state.ids[(index + n) % state.ids.length];
        return state.entities[next];
      })
    )
      .subscribe(track => this.store.dispatch(new PlayTrack({ track: track._id })))
  }

  next() {
    this.jump(1);
  }

  previous() {
    this.jump(-1);
  }

  play(trackId: string) {
    if (this.audio$) {
      this.audio$.unsubscribe();
    }
    if (this.audio) {
      this.audio.stop();
    }

    this.audio$ = this.songService.getBydId(trackId)
      .pipe(
        switchMap(track => this.fetchAudio(track)),
        tap(audio => audio.play())
      )
      .subscribe((audio) => this.audio = audio);

  }

  async fetchAudio(track: Song): Promise<Howl> {

    const src = await this.songService.getSource(track);

    return new Promise((resolve, reject) => {
      const track = new Howl({
        src: src,
        html5: true, // allows buffering
        xhrWithCredentials: true,

        onload: () => resolve(track),
        onerror: err => reject(err),

        onplay: () => this.store.dispatch(new TrackPlaying()),
        onpause: () => this.store.dispatch(new TrackPaused()),
        onend: () => this.store.dispatch(new TrackFinished()),
      });
    });
  }

  pause() {
    if (this.audio) this.audio.pause();
  }

}
