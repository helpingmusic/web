import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { CropperSettings } from 'ng2-img-cropper';


class PhotoUploadData {
  type: string;
  settings: CropperSettings;
}

@Component({
  selector: 'home-upload-photo-modal',
  templateUrl: './upload-photo-modal.component.html',
  styleUrls: ['./upload-photo-modal.component.scss']
})
export class UploadPhotoModalComponent implements OnInit {

  photo: any;

  constructor(
    private ref: MatDialogRef<UploadPhotoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PhotoUploadData,
  ) { }

  ngOnInit() {
  }

  upload() {
    this.ref.close(this.photo);
  }

}
