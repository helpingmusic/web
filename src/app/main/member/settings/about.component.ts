import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as globals from 'app/globals';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'settings-about',
  template: `
    <form (ngSubmit)="onSubmit(aboutForm)"
          novalidate
          [formGroup]="aboutForm"
          action="javascript:void(0)">

      <panel #panel [collapsible]="true" [collapsed]="true">

        <panel-heading>
          <h4>About</h4>
        </panel-heading>

        <panel-body>

          <div class="col-sm-4">
            <div class="form-group label-floating mt-n"
                 [ngClass]="{'has-error': showError('profession') }">
              <label for="profession" class="control-label">Profession</label>
              <input type="text"
                     class="form-control"
                     name="profession"
                     required
                     formControlName="profession"
              />
              <div *ngIf="showError('profession')">
                <p class="hint" [hidden]="!aboutForm.get('profession').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

          <div class="col-sm-4">
            <div class="form-group label-floating mt-n"
                 [ngClass]="{'has-error': showError('city') }">
              <label for="city" class="control-label">City</label>
              <input type="text"
                     class="form-control"
                     name="city"
                     required
                     formControlName="city"
              />
              <div *ngIf="showError('city')">
                <p class="hint" [hidden]="!aboutForm.get('city').errors.required">This field is required.</p>
              </div>
            </div>
          </div>


          <div class="col-sm-4">
            <div class="form-group mt-n"
                 [ngClass]="{'has-error': showError('state') }">

              <select class="form-control" name="state" required formControlName="state" stateSelector>
                <option value="">Select a State</option>
              </select>

              <div *ngIf="showError('state')">
                <p class="hint" [hidden]="!aboutForm.get('state').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

          <div class="col-xs-12 clear">
            <div class="form-group mt-n"
                 [ngClass]="{'has-error': showError('bio') }">

              <label for="bio">Bio</label>
              <p class="mb-sm">
                Just give us a few words. You can change it whenever you want.
                Are you in a band? Have you put any music out? Have you worked
                on any notable projects? Let us know!
              </p>
              <mat-form-field>
                <textarea name="bio"
                          matInput
                          matTextareaAutosize
                          rows="8"
                          formControlName="bio"
                ></textarea>

                <div *ngIf="showError('bio')">
                  <mat-error *ngIf="aboutForm.get('bio').errors?.required">This field is required.</mat-error>
                </div>
              </mat-form-field>

            </div>
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
        </panel-body>

        <panel-footer>
          <home-btn
            [class]="'btn btn-info btn-sm pull-right mt-n'"
            [type]="'submit'"
            [isLoading]="isLoading">
            Save
          </home-btn>

          <div class="pull-right" *ngIf="success">
            <success-icon></success-icon>
          </div>
        </panel-footer>
      </panel>

    </form>
  `,
  styles: []
})
export class AboutComponent implements OnInit {
  aboutForm: FormGroup;
  member = new User();

  isLoading: boolean;
  success: boolean;
  submitted: boolean;

  instrumentPresets: Array<string> = globals.instrumentPresets;
  genrePresets: Array<string> = globals.genrePresets;
  skillPresets: Array<string> = globals.skillPresets;
  resourcePresets: Array<string> = globals.resourcePresets;

  @ViewChild('panel') panel;

  constructor(
    private auth: AuthService,
    private modal: ModalService,
    private fb: FormBuilder,
  ) {
    this.aboutForm = fb.group({
      profession: '',
      city: '',
      state: '',
      bio: '',
      instruments: '',
      genres: '',
      skills: '',
      resources: '',
    })
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.member = u;
        this.aboutForm.patchValue(this.member);
      });
  }

  triggerSubmit() {
    this.onSubmit(this.aboutForm);
  }

  onSubmit(form) {
    this.submitted = true;

    if (form.invalid) return;

    this.isLoading = true;
    this.success = false;

    this.auth.updateAccount(form.value).pipe(
      first())
      .subscribe(
        () => {
          this.success = true;
          this.isLoading = false;
        },
        err => {
          this.isLoading = false;
          this.modal.error();
        },
      )
  }

  // Helper function for template
  // See if input should show invalid
  showError(tag: string) {
    let invalid = this.aboutForm.get(tag).invalid,
      touched = this.aboutForm.get(tag).touched,
      dirty = this.aboutForm.get(tag).dirty;

    let show = false;

    if (invalid && (touched || dirty)) show = true;
    if (this.submitted && invalid) show = true;

    return show;
  }

}
