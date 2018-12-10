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
      this.photoChange.emit(this.data.image);
    });
  }

  fileChangeListener($event) {
    const image: any = new Image();
    const file: File = $event.target.files[0];

    if (!file) return;
    this.processing = true;
    this.filename = file.name;

    const myReader: FileReader = new FileReader();

    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
      this.processing = false;
    };

    myReader.readAsDataURL(file);
  }

}
