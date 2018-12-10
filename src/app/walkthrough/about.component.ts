import { first } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { User } from 'models/user';
import { membershipTypes } from 'app/globals';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';
import { AuthService } from 'app/core/auth/auth.service';
import { walkthroughAnimation } from 'app/walkthrough/walkthrough.animation';
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'home-about',
  animations: [walkthroughAnimation],
  host: { '[@routerTransition]': '' },
  template: `
    <form (ngSubmit)="onSubmit(aboutForm)"
          novalidate
          [formGroup]="aboutForm"
          action="javascript:void(0)">

      <div class="panel panel-default">

        <div class="panel-body row mb-n">
          <div class="col-xs-12">
            <h4>Membership Categories</h4>
            <p class="subtext">
              You must fit into at least one of these categories to become a HOME member. Check all boxes that apply.
            </p>

            <div class=" col-sm-6" *ngFor="let t of membershipTypes; let i=index">
              <div class="checkbox m-n">
                <label>
                  <input type="checkbox"
                         [formControl]="aboutForm.controls['membershipTypes'].controls[i]"
                         [value]="t.name"
                  />
                  <h5 class="inblock">{{t.name | pretty}}</h5>
                  <p class="subtext">{{t.description}}</p>
                </label>
              </div>

            </div>

            <div class="clear text-center" *ngIf="aboutForm.get('membershipTypes').invalid && submitted">
              <p class="hint" [hidden]="!aboutForm.get('membershipTypes').errors.required">
                You must select at least one membership type.
              </p>
            </div>
          </div>

          <div class="col-xs-12 clear pb-md">
            <h4>About</h4>
          </div>

          <div class="col-sm-6 clear">
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
          <div class="col-sm-6">
            <div class="form-group label-floating mt-n"
                 [ngClass]="{'has-error': showError('phoneNumber') }">
              <label for="profession" class="control-label">Phone Number</label>
              <input type="text"
                     class="form-control"
                     name="phoneNumber"
                     required
                     formControlName="phoneNumber"
              />
              <div *ngIf="showError('phoneNumber')">
                <p class="hint" [hidden]="!aboutForm.get('phoneNumber').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

          <div class="col-sm-6 clear">
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


          <div class="col-sm-6">
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
              <textarea name="bio"
                        rows="8"
                        class="form-control"
                        formControlName="bio"
                        required
              ></textarea>

              <div *ngIf="showError('bio')">
                <p class="hint" [hidden]="!aboutForm.get('bio').errors.required">This field is required.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-footer clearfix">
          <button class="btn btn-default btn-sm pull-left"
                  (click)="back()">
            Back
          </button>
          <home-btn
            [class]="'btn btn-info btn-sm pull-right mt-n'"
            [type]="'submit'"
            [disabled]="aboutForm.invalid"
            [isLoading]="isLoading">
            Save
          </home-btn>

        </div>
      </div>

    </form>
  `,
  styles: []
})
export class AboutComponent implements OnInit, AfterViewInit {
  aboutForm: FormGroup;
  member = new User();

  isLoading: boolean;
  success: boolean;
  submitted: boolean;
  membershipTypes = membershipTypes;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private walkthrough: WalkthroughService,
    private store: StoreService,
  ) {
    this.aboutForm = fb.group({
      profession: '',
      phoneNumber: '',
      city: '',
      state: '',
      bio: '',
      membershipTypes: fb.array(
        [false, false, false, false, false],
        (control: AbstractControl): any => (
          // Include at least one true value;
          control.value.filter(v => v).length ? null : { 'required': true }
        )
      ),
    });

    this.aboutForm.patchValue(store.get('walkthrough.about') || {});
    this.aboutForm.valueChanges
      .subscribe(form => store.set('walkthrough.about', form));
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.member = u;
        this.aboutForm.patchValue(this.member);
      });
  }

  ngAfterViewInit() {
    $.material.init('home-about *');
  }

  back() {
    this.walkthrough.back();
  }

  onSubmit(form) {
    this.submitted = true;

    if (form.invalid) return;

    this.isLoading = true;
    this.success = false;

    const f = form.value;

    f.membership_types = form.value.membershipTypes
      .map((t, i) => t ? this.membershipTypes[i].name : null)
      .filter(t => t);

    this.auth.updateAccount(f).pipe(
      first())
      .subscribe(
        () => this.walkthrough.next(),
        err => this.isLoading = false,
      );
  }

  // Helper function for template
  // See if input should show invalid
  showError(tag: string) {
    const { invalid, touched, dirty } = this.aboutForm.get(tag);
    let show = false;

    if (invalid && (touched || dirty)) show = true;
    if (this.submitted && invalid) show = true;

    return show;
  }


}
