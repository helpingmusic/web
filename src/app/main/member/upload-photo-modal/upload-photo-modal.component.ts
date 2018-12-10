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
    const blob = this.dataURItoBlob(this.photo);
    this.ref.close(blob);
  }

  private dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
  }
}
