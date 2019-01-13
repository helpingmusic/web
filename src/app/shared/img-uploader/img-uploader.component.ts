import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CropperSettings, ImageCropperComponent } from 'ng2-img-cropper';

@Component({
  selector: 'home-img-uploader',
  templateUrl: './img-uploader.component.html',
  styleUrls: ['./img-uploader.component.scss']
})
export class ImgUploaderComponent implements OnInit {
  filename: string;
  processing: boolean;
  data: any = {};
  file: File;

  @ViewChild('cropper') cropper: ImageCropperComponent;
  @Output('photoChange') photoChange = new EventEmitter<any>();

  private _settings = new CropperSettings();
  @Input('settings')
  set settings(value) {
    this._settings = value || new CropperSettings();
    this._settings.noFileInput = true;
    this.cropper.settings = this._settings;
  }

  get settings() {
    return this._settings;
  }

  constructor() {
  }

  ngOnInit() {
    this.cropper.cropcanvas.nativeElement.click();
    this.cropper.onCrop.subscribe(() => {
      const img = this.dataURItoBlob(this.data.image);
      this.photoChange.emit(img);
    });
  }

  private dataURItoBlob(dataURI) {
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for(let i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {
      type: this.file.type || 'image/jpeg'
    });
  }

  fileChangeListener($event) {
    const image: any = new Image();
    this.file = $event.target.files[0];

    if (!this.file) return;
    this.processing = true;
    this.filename = this.file.name;

    const myReader: FileReader = new FileReader();

    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
      this.processing = false;
    };

    myReader.readAsDataURL(this.file);
  }

}
