import { first, switchMap } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { Router } from '@angular/router';

import { User } from 'models/user';
import { membershipTypes } from 'app/globals';
import { AuthService } from 'app/core/auth/auth.service';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';
import { Observable } from 'rxjs';
import { walkthroughAnimation } from 'app/walkthrough/walkthrough.animation';
import { passwordMatcher } from 'app/shared/password-matcher.directive';
import { StoreService } from 'app/core/store.service';

@Component({
  selector: 'home-account-info',
  animations: [walkthroughAnimation],
  host: { '[@routerTransition]': '' },
  template: `
    <div class="panel panel-white no-animate">
      <div class="panel-heading">
        <h3>Account Info</h3>
      </div>

      <form class="form"
            [formGroup]="accountForm"
            (ngSubmit)="onSubmit(accountForm)"
            action="javascript:void(0);">

        <div class="panel-body row">

          <div class="col-sm-6">
            <div class="form-group label-floating "
                 [ngClass]="{'has-error': showError('first_name') }">
              <label for="first_name" class="control-label">First Name</label>
              <input type="text"
                     class="form-control"
                     name="first_name"
                     required
                     formControlName="first_name"
              />
              <div *ngIf="showError('first_name')">
                <p class="hint" [hidden]="!accountForm.get('first_name').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

          <div class="col-sm-6">
            <div class="form-group label-floating "
                 [ngClass]="{'has-error': showError('last_name') }">
              <label for="last_name" class="control-label">Last Name</label>
              <input type="text"
                     class="form-control"
                     name="last_name"
                     required
                     formControlName="last_name"
              />
              <div *ngIf="showError('last_name')">
                <p class="hint" [hidden]="!accountForm.get('last_name').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

          <div class="col-sm-12">
            <div class="form-group label-floating "
                 [ngClass]="{'has-error': showError('email') }">
              <label for="email" class="control-label">Email</label>
              <input type="text"
                     class="form-control"
                     name="email"
                     required
                     formControlName="email"
              />
              <div *ngIf="showError('email')">
                <p class="hint" [hidden]="!accountForm.get('email').errors.required">This field is required.</p>
                <p class="hint" [hidden]="!accountForm.get('email').errors.email">Not a valid email.</p>
                <p class="hint" [hidden]="!accountForm.get('email').errors.server">{{ accountForm.get('email').errors.server }}</p>
              </div>
            </div>
          </div>


          <div formGroupName="passwords" *ngIf="showPasswords">
            <div class="col-sm-6">
              <div class="form-group label-floating "
                   [ngClass]="{'has-error': showError('passwords.password') }">
                <label for="password" class="control-label">Password</label>
                <input type="password"
                       class="form-control"
                       name="password"
                       required
                       formControlName="password"
                />
                <div *ngIf="showError('passwords.password')">
                  <p class="hint" [hidden]="!accountForm.get('passwords.password').errors.required">
                    This field is required.
                  </p>
                  <p class="hint" [hidden]="!accountForm.get('passwords.password').errors.minlength">
                    Password must be at least 6 characters.
                  </p>
                  <p class="hint">{{errors.password}}</p>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
              <div class="form-group label-floating "
                   [ngClass]="{'has-error': showError('passwords.confirm') }">
                <label for="confirm" class="control-label">Confirm Password</label>
                <input type="password"
                       class="form-control"
                       name="confirm"
                       required
                       formControlName="confirm"
                />
                <div *ngIf="showError('passwords.confirm')">
                  <p class="hint" [hidden]="!accountForm.get('passwords.confirm').errors.required">This field is required.</p>
                </div>
                <div *ngIf="showError('passwords')">
                  <p class="hint" [hidden]="!accountForm.hasError('nomatch', 'passwords')">Password fields do not match.</p>
                </div>
              </div>
            </div>


          </div>

          <div class="col-sm-12">
            <div class="form-group label-floating "
                 [ngClass]="{'has-error': showError('agreeToTerms') }">
              <div class="checkbox">
                <label>
                  <input type="checkbox"
                         name="agreeToTerms"
                         formControlName="agreeToTerms"/>
                  I Agree To the
                  <a [routerLink]="['/terms']">Membership Agreement</a>
                </label>
              </div>
              <div *ngIf="showError('agreeToTerms')">
                <p class="hint" [hidden]="!accountForm.get('agreeToTerms').errors.required">This field is required.</p>
              </div>
            </div>
          </div>

        </div>

        <div class="panel-footer">
          <div class="clearfix">
            <home-btn
              [class]="'btn btn-info btn-sm pull-right'"
              [type]="'submit'"
              [disabled]="accountForm.invalid"
              [isLoading]="isLoading">
              Next
            </home-btn>

          </div>
        </div>
      </form>
    </div>

    <div class="row">
      <div class="col-sm-6">
        <oauth-btn
          type="facebook"
          icon="facebook"
          title="Facebook"
        ></oauth-btn>
      </div>
      <div class="col-sm-6">
        <oauth-btn
          type="google"
          icon="google-plus"
          title="Google+"
        ></oauth-btn>
      </div>
    </div>
  `,
  styles: [`
  `],
})
export class AccountInfoComponent implements OnInit, AfterViewInit {
  isLoading: boolean;
  errors: any = {};
  submitted: boolean;
  accountForm: FormGroup;
  user$: Observable<User>;
  membershipTypes = membershipTypes;
  showPasswords = true;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private walkthrough: WalkthroughService,
    private store: StoreService,
  ) {
    this.accountForm = fb.group({
      first_name: ['', val.required],
      last_name: ['', val.required],
      email: ['', [val.required, val.email]],
      agreeToTerms: ['', val.requiredTrue],
      passwords: fb.group({
        password: ['', [val.required, val.minLength(6)]],
        confirm: ['', [val.required]],
      }, { validator: passwordMatcher }),
    });

    this.accountForm.patchValue(store.get('walkthrough.account') || {});
    this.accountForm.valueChanges
      .subscribe(form => store.set('walkthrough.account', form));
  }

  ngOnInit() {
    this.user$ = this.auth.getCurrentUser().pipe(first());
    this.user$
      .subscribe(u => {
        console.log(u);
        this.accountForm.patchValue({
          first_name: u.first_name,
          last_name: u.last_name,
          email: u.email,
          membershipTypes: this.membershipTypes.map(t => u.membership_types.indexOf(t.name) !== -1)
        });

        if (u._id && (u.hasPassword || u.provider !== 'local')) {
          this.showPasswords = false;
          this.accountForm.removeControl('passwords');
        }

      });
  }

  ngAfterViewInit() {
    $.material.init('home-account-info *');
  }

  onSubmit(form) {
    this.submitted = true;

    if (!form.valid) return;

    this.isLoading = true;

    this.auth.getCurrentUser().pipe(
      first(),
      switchMap(u => {
        // Signup if account hasn't been created yet, otherwise update
        if (!u.hasPassword) {
          Object.assign(u, form.value, {
            password: form.value.passwords.password
          });
        }
        if (!u._id) {
          return this.auth.signup(u);
        }

        return this.auth.updateAccount(u);
      }),
      first(),)
      .subscribe(
        u => this.walkthrough.next(),
        err => {
          console.log(err);
          this.isLoading = false;

          const errors = JSON.parse(err.error).errors;
          console.log(errors);
          console.log(this.accountForm);

          Object.keys(errors)
            .forEach(k => this.accountForm.get(k).setErrors({ server: errors[k].message }));
        }
      );
  }

  // Helper function for template
  // See if input should show invalid
  showError(tag: string) {
    const { invalid, touched, dirty } = this.accountForm.get(tag);
    let show = false;

    if (invalid && (touched || dirty)) show = true;
    if (this.submitted && invalid) show = true;

    return show;
  }
}
