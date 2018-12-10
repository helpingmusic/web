import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { AnnouncementService } from 'app/main/announcements/announcement.service';
import { Announcement } from 'models/announcement';

@Component({
  selector: 'home-edit-announcement-modal',
  templateUrl: './edit-announcement-modal.component.html',
  styleUrls: ['./edit-announcement-modal.component.scss']
})
export class EditAnnouncementModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditAnnouncementModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { announcement: Announcement },
    private announcementService: AnnouncementService,
  ) {
    this.form = fb.group({
      title: [data.announcement.title, [val.required]],
      body: [data.announcement.body, [val.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    if (this.data.announcement._id) {
      this.announcementService.update(this.data.announcement._id, form.value);
    } else {
      this.announcementService.create(form.value);
    }

    this.ref.close(true);
  }

}
