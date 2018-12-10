import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UploadPhotoModalComponent } from 'app/main/member/upload-photo-modal/upload-photo-modal.component';

import { CropperSettings } from 'ng2-img-cropper';

import { ModalService } from 'app/core/modal.service';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { ImgUploaderComponent } from 'app/shared/img-uploader/img-uploader.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'home-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss'],
})
export class MemberComponent implements OnInit {
  isOwnAccount: boolean;
  photoUploadLoading: boolean;

  // @ViewChild('profileImgModal') profileImgModal: any;
  // @ViewChild('bannerImgModal') bannerImgModal: any;
  // @ViewChild('profileImg') profileImg: ImgUploaderComponent;
  // @ViewChild('bannerImg') bannerImg: ImgUploaderComponent;
  // profilePic: any;
  // bannerPic: any;
  profileUploadSettings: CropperSettings;
  bannerUploadSettings: CropperSettings;

  // Account being looked at
  public member: User = new User();

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private modal: ModalService,
    private dialog: MatDialog,
  ) {

    this.profileUploadSettings = new CropperSettings();
    this.profileUploadSettings.width = 300;
    this.profileUploadSettings.height = 300;
    this.profileUploadSettings.minWidth = 150;
    this.profileUploadSettings.minHeight = 150;
    this.profileUploadSettings.croppedWidth = 800;
    this.profileUploadSettings.croppedHeight = 800;
    this.profileUploadSettings.canvasWidth = 400;
    this.profileUploadSettings.canvasHeight = 400;

    this.bannerUploadSettings = new CropperSettings();
    this.bannerUploadSettings.width = 1000;
    this.bannerUploadSettings.height = 400;
    this.bannerUploadSettings.minWidth = 300;
    this.bannerUploadSettings.minHeight = 150;
    this.bannerUploadSettings.croppedWidth = 1200;
    this.bannerUploadSettings.croppedHeight = 500;
    this.bannerUploadSettings.canvasWidth = 1000;
    this.bannerUploadSettings.canvasHeight = 400;
  }

  ngOnInit() {
    this.route.data
      .subscribe((data: { member: User }) => {
        this.member = data.member;

        this.auth.getCurrentUser()
          .subscribe((u: User) => {
            this.isOwnAccount = (this.member._id === u._id);
            if (this.isOwnAccount) {
              this.member = u;
            }
          });
      });
  }

  uploadProfilePicture() {
    const ref = this.dialog.open(UploadPhotoModalComponent, {
      // width: '400px',
      data: {
        type: 'profile_pic',
        settings: this.profileUploadSettings,
      }
    });

    ref.beforeClosed()
      .pipe(filter(img => !!img))
      .subscribe(img => this.onImageSave('profile_pic', img));
  }

  uploadBanner() {
    const ref = this.dialog.open(UploadPhotoModalComponent, {
      width: '600px',
      data: {
        type: 'banner',
        settings: this.bannerUploadSettings,
      }
    });

    ref.beforeClosed()
      .pipe(filter(img => !!img))
      .subscribe(img => this.onImageSave('banner', img));
  }


  onImageSave(type: string, img: Blob) {
    if (!type || !img) return;

    this.photoUploadLoading = true;

    this.auth.addPhotos({ [type]: img })
      .subscribe(
        () => {},
        err => {
          console.log(err);
          this.modal.popup({
            type: 'error',
            title: 'Attempt Failed',
            text: 'Something went wrong, please try again later.'
          });
        }
      );
  }

}
