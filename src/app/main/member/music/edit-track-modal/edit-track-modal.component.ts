import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { TrackService } from 'app/core/music/track.service';
import { AudioInputData } from 'app/shared/audio-input/audio-input.component';
import { Song } from 'models/song';

@Component({
  selector: 'home-edit-track-modal',
  templateUrl: './edit-track-modal.component.html',
  styleUrls: ['./edit-track-modal.component.scss']
})
export class EditTrackModalComponent implements OnInit {

  form: FormGroup;

  get editing() {
    return this.data && this.data.track;
  }

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditTrackModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { track: Song },
    private trackService: TrackService,
  ) {
    const t = data ? data.track : { title: '', tags: ['Indie'] } as any;
    this.form = fb.group({
      title: [t.title, [val.required]],
      tags: [[...t.tags], [val.required]],
      track: [],
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    if (this.editing) {
      this.trackService.update(this.data.track._id, form.value);

    } else {
      const fd = new FormData();
      const v = form.value;
      fd.append('title', v.title);
      fd.append('tags', v.tags);

      const d = form.value.track as AudioInputData;
      fd.append('duration', String(d.duration));
      fd.append('track', d.file);

      this.trackService.create(fd);
    }

    this.ref.close(true);
  }

}
