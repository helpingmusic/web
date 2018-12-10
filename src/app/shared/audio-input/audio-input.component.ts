import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { Howl } from 'howler';
import { BehaviorSubject } from 'rxjs';

import { Song } from 'models/song';
import { TrackService } from 'app/core/music/track.service';

export class AudioInputData {
  file: File;
  duration: number;
}

@Component({
  selector: 'home-audio-input',
  templateUrl: './audio-input.component.html',
  styleUrls: ['./audio-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AudioInputComponent),
      multi: true
    }
  ],
})
export class AudioInputComponent implements OnInit, OnDestroy, ControlValueAccessor {

  error: string;
  track: Howl;
  processing: boolean;
  isPlaying: boolean;
  seekInterval: any;
  progress$ = new BehaviorSubject<number>(0);

  @Input('song') _song: Song;
  @Input('disabled') disabled: boolean;

  onChange: any = () => { };
  onTouched: any = () => { };

  get song() {
    return this._song;
  }

  get data(): AudioInputData {
    return {
      duration: this._duration,
      file: this._file,
    }
  }

  private _duration: number;
  set duration(d: number) {
    this._duration = d;
    this.onChange(this.data)
  }

  private _file: File;
  get file() {
    return this._file;
  }
  set file(f: File) {
    this._file = f;
    this.loadTrackPreview();
  }

  constructor(
    private songService: TrackService,
  ) {
  }

  ngOnInit() {
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

  writeValue(data: AudioInputData) {
    if (data) {
      this.duration = data.duration;
      this.file = data.file;
    }
  }

  async loadTrackPreview() {
    console.log('preview');

    if (!this._file) return;
    this.processing = true;

    const reader = new FileReader();
    reader.readAsDataURL(this._file);

    const src = await new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
    });

    this.songService.getTrack(src)
      .then(track => {
        console.log(track);
        this.duration = track.duration();
        this.track = track;
        this.processing = false;
      });
  }

  onFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    this.pause();

    this.file = file;
  }

  trackPreview(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isPlaying = true;
    const duration = this.track.duration();

    if (this.track.seek() === 0) {
      this.track.play();
    } else {
      // Fade back in if already playing
      this.track.fade(0, 1, 200);
      this.track.once('fade', () => this.track.play());
    }

    this.seekInterval = setInterval(() => {
      this.progress$.next(100 * this.track.seek() / duration);
    }, 200);
  }

  pause(event?) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (!this.track) return;

    this.isPlaying = false;
    if (this.track && typeof this.track.pause === 'function') {
      this.track.fade(1, 0, 200);
      this.track.once('fade', () => {
        this.track.pause();
        clearInterval(this.seekInterval);
      });
    }
  }

  ngOnDestroy() {
    if (this.track && this.isPlaying) {
      this.track.pause();
    }
  }

}
