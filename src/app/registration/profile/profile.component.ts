import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { PersonalLinksFormComponent } from 'app/components/forms/personal-links-form/personal-links-form.component';
import { AuthService } from 'app/core/auth/auth.service';
import { StepUpdate } from 'app/registration/registration.actions';
import { WalkthroughStep } from 'app/registration/walkthrough-step';
import { CropperSettings } from 'ng2-img-cropper';
import { zip } from 'rxjs';
import { filter, first, pluck, tap } from 'rxjs/operators';
import * as fromRegistration from '../registration.reducer';
import * as globals from 'app/globals';

export interface ProfileForm {
  instruments: string[];
  genres: string[];
  skills: string[];
  resources: string[];
  personal_links: any;
  profilePic: string;
}

@Component({
  selector: 'home-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, WalkthroughStep<ProfileForm> {

  profileForm: FormGroup;
  isLoading: boolean;
  submitted: boolean;
  @Output() completed = new EventEmitter<ProfileForm>();

  instrumentPresets: Array<string> = globals.instrumentPresets;
  genrePresets: Array<string> = globals.genrePresets;
  skillPresets: Array<string> = globals.skillPresets;
  resourcePresets: Array<string> = globals.resourcePresets;

  profileUploadSettings: CropperSettings;

  constructor(
    fb: FormBuilder,
    private auth: AuthService,
    private store: Store<fromRegistration.State>
  ) {
    this.profileForm = fb.group({
      instruments: [],
      genres: [],
      skills: [],
      resources: [],
      personal_links: PersonalLinksFormComponent.build(),
      profilePic: ['', val.required],
    });

    this.profileUploadSettings = Object.assign(new CropperSettings(), {
      width: 300,
      height: 300,
      minWidth: 150,
      minHeight: 150,
      croppedWidth: 300,
      croppedHeight: 300,
      canvasWidth: 400,
      canvasHeight: 400,
    });

  }

  ngOnInit() {
    this.watchForm();
  }

  watchForm() {
    this.store.pipe(
      first(),
      select(fromRegistration.selectRegistrationState),
      pluck('profile'),
      tap(v => console.log(v)),
      filter(v => !!v),
    )
      .subscribe(val => this.profileForm.patchValue(val, { emitEvent: true }));

    this.profileForm.valueChanges
      .subscribe(data => {
        this.store.dispatch(new StepUpdate({
          step: 'profile',
          data,
        }))
      })
  }

  onPhotoChange(profilePic: any) {
    this.profileForm.patchValue({ profilePic });
  }

  onSubmit(form: FormGroup) {
    this.submitted = true;
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

    return zip(
      this.auth.addPhotos({ profile_pic: this.profileForm.get('profilePic').value }),
      this.auth.updateAccount(body),
    )
      .pipe(first())
      .subscribe(
        () => this.completed.emit(),
        ({ error }) => {
          console.error(error);
          this.profileForm.get(error.field).setErrors({ server: error.message });
          this.profileForm.get(error.field).markAsTouched();
        },
        () => this.isLoading = false,
      );
  }


}
