import { PersonalLinksFormComponent } from 'app/components/forms/personal-links-form/personal-links-form.component';
import { of, zip } from 'rxjs';
import { filter, first, tap } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';

import * as globals from 'app/globals';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';
import { walkthroughAnimation } from 'app/walkthrough/walkthrough.animation';
import { CropperSettings } from 'ng2-img-cropper';
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'home-skills',
  animations: [walkthroughAnimation],
  host: { '[@routerTransition]': '' },
  template: `
    <form (ngSubmit)="onSubmit(profileForm)"
          novalidate
          [formGroup]="profileForm"
          action="javascript:void(0)">

      <div class="panel panel-default">

        <div class="panel-heading">
          <h3 class="mb-n">Profile</h3>
        </div>

        <div class="panel-body">
          <div class="col-xs-12">
            <p class="subtext">Use the return/enter key to input data tags so that you can be discovered in the HOME community.</p>
          </div>

          <div class="col-xs-12">
            <home-tag-input placeholder="Instruments" formControlName="instruments"></home-tag-input>
          </div>

          <div class="col-xs-12">
            <home-tag-input placeholder="Music Genres" formControlName="genres"></home-tag-input>
          </div>

          <div class="col-xs-12">
            <home-tag-input placeholder="Skills" formControlName="skills"></home-tag-input>
          </div>

          <div class="col-xs-12">
              <home-tag-input placeholder="Resources" formControlName="resources"></home-tag-input>
          </div>
          
          <div class="col-xs-12">
            <h4>Web Presence</h4>
            <p class="subtext mb-lg">
              Provide valid URL so others can find you on other social media.
            </p>

            <home-personal-links-form [form]="profileForm.get('personal_links')"></home-personal-links-form>
          </div>

          
          <div *ngIf="showProfileImgUpload" class="col-xs-12">
            <h4>Profile Image</h4>
            <div class="row">
              <div class="col-sm-12">
                <p [hidden]="!errors.profilePic" class="hint error">
                  A profile picture is required.
                </p>

                <div class="center-block">
                  <home-img-uploader [settings]="profileUploadSettings"
                                     (photoChange)="onPhotoChange($event)">
                  </home-img-uploader>
                </div>

              </div>
            </div>
          </div>

        </div>

        <div class="panel-footer">
          <button class="btn btn-default btn-sm pull-left"
                  (click)="back()">
            Back
          </button>

          <home-btn
            [class]="'btn btn-info btn-sm pull-right mt-n'"
            [type]="'submit'"
            [isLoading]="isLoading">
            Save
          </home-btn>
        </div>
      </div>

    </form>
  `,
  styles: [`
    /deep/ .imgUploader {
      padding: 16px !important;
      background: none !important;
    }
    
    .link-icon i {
      color: #777;
      font-size: 1.2em;
      margin-right: 12px;
    }

    /deep/ .imgUploader canvas {
      max-width: 100%;
    }
  `]
})
export class ProfileComponent implements OnInit, AfterViewInit {

  profileForm: FormGroup;
  member = new User();

  isLoading: boolean;
  submitted: boolean;

  instrumentPresets: Array<string> = globals.instrumentPresets;
  genrePresets: Array<string> = globals.genrePresets;
  skillPresets: Array<string> = globals.skillPresets;
  resourcePresets: Array<string> = globals.resourcePresets;

  profileImg: any;
  profileUploadSettings: CropperSettings;
  showProfileImgUpload = true;
  errors: any = { profilePic: false };

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private walkthrough: WalkthroughService,
    private store: StoreService,
  ) {

    this.profileForm = fb.group({
      instruments: [],
      genres: [],
      skills: [],
      resources: [],
      personal_links: PersonalLinksFormComponent.build(),
    });


    this.profileForm.patchValue(store.get('walkthrough.profile') || {});
    this.profileForm.valueChanges
      .subscribe(form => store.set('walkthrough.profile', form));

    this.profileUploadSettings = new CropperSettings();
    this.profileUploadSettings.width = 300;
    this.profileUploadSettings.height = 300;
    this.profileUploadSettings.minWidth = 150;
    this.profileUploadSettings.minHeight = 150;
    this.profileUploadSettings.croppedWidth = 300;
    this.profileUploadSettings.croppedHeight = 300;
    this.profileUploadSettings.canvasWidth = 400;
    this.profileUploadSettings.canvasHeight = 400;

  }

  ngOnInit() {
    this.profileForm.patchValue(this.store.get('walkthrough.profile') || {});
    this.auth.getCurrentUser().pipe(
      filter(u => !!(u.instruments && u.instruments.length)))
      .subscribe(u => {
        this.member = u;
        this.showProfileImgUpload = !this.member.profile_pic;
        this.profileForm.patchValue({
          instruments: this.member.instruments,
          genres: this.member.genres,
          skills: this.member.skills,
          resources: this.member.resources,
          personal_links: u.personal_links,
        });
      });
  }

  ngAfterViewInit() {
    $.material.init('home-skills');
  }

  back() {
    this.walkthrough.back();
  }

  onPhotoChange(pic: any) {
    this.errors.profilePic = false;
    this.profileImg = pic;
  }

  onSubmit(form) {
    this.submitted = true;
    console.log(form);
    if (form.invalid) return;

    this.isLoading = true;

    const f = form.value;

    const body: any = {
      instruments: f.instruments || [],
      genres: f.genres || [],
      skills: f.skills || [],
      resources: f.resources || [],
      personal_links: f.personal_links,
    };

    Object.keys(body.personal_links)
      .forEach(k => body.personal_links[k] || delete body.personal_links[k]);

    let photos = of();
    if (this.profileImg) {
      photos = this.auth.addPhotos({ profile_pic: this.profileImg });
    }

    return zip(
      photos,
      this.auth.updateAccount(body),
    )
      .subscribe(
        () => this.walkthrough.next(),
        err => this.isLoading = false,
      );
  }


}
