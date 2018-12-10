import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { CreateTrack, DeleteTrack, FetchTracksForUser, PauseTrack, PlayTrack, UpdateTrack } from 'app/core/music/actions/tracks.actions';

import { Howl } from 'howler';
import { Song } from 'models/song';
import { first, map } from 'rxjs/operators';
import { selectTrackById, selectTracksForUser } from './reducers/tracks.reducer';
import * as fromTracks from './reducers/tracks.reducer';

@Injectable()
export class TrackService {

  endpoint = '/songs';

  constructor(
    private http: HttpClient,
    private store: Store<fromTracks.State>
  ) {
  }

  create(track: FormData) {
    this.store.dispatch(new CreateTrack({ track }));
  }

  update(id: string, changes: Partial<Song>) {
    this.store.dispatch(new UpdateTrack({ id, changes }));
  }

  delete(trackId: string) {
    this.store.dispatch(new DeleteTrack({ trackId }));
  }

  play(track?: string) {
    this.store.dispatch(new PlayTrack({ track }));
  }
  pause() {
    this.store.dispatch(new PauseTrack());
  }

  getForUser(userId: string) {
    this.store.dispatch(new FetchTracksForUser({ userId }));
    return this.store.pipe(select(selectTracksForUser, userId));
  }

  getStream(s: Song): Promise<any> {
    return this.http.get(`${this.endpoint}/${s._id}/stream`, {
      responseType: 'arraybuffer',
    })
      .pipe( map(buf => this.arraybufferToDataURI(buf, s.mediaType)) )
      .toPromise();
  }


  getSource(song: Song): Promise<Howl> {
    let srcPromise;

    // If no href or song file size is different than what was persisted
    // (this means that a new file was uploaded)
    try {
      const reader = new FileReader();
      reader.readAsDataURL(song.file);

      srcPromise = new Promise((resolve, reject) => {
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
      });
    } catch (err) {
      srcPromise = this.getStream(song);
    }

    return srcPromise;
  }

  getBydId(t: string) {
    return this.store.pipe(select(selectTrackById, t), first());
  }

  getTrack(src: any): Promise<Howl> {
    return new Promise((resolve, reject) => {
      const track = new Howl({
        src: [src],
        onload: () => resolve(track),
        onloaderror: (e, a) => {
          console.error(e, a);
          reject(new Error('File type not supported'));
        }
      });
    });
  }

  /**
   * Take an array buffer and make it into a usable data uri
   */
  private arraybufferToDataURI(buffer, encoding) {
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    let bytes = new Uint8Array(buffer),
      i, len = bytes.length, base64 = '';

    for (i = 0; i < len; i += 3) {
      base64 += chars[bytes[i] >> 2];
      base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
      base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
      base64 += chars[bytes[i + 2] & 63];
    }

    if ((len % 3) === 2) {
      base64 = base64.substring(0, base64.length - 1) + '=';
    } else if (len % 3 === 1) {
      base64 = base64.substring(0, base64.length - 2) + '==';
    }
    return `data:${encoding};base64,${base64}`;
  }

}
