import { first } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'settings-password',
  template: `
    <form (ngSubmit)="onSubmit(passwordForm)"
          #passwordForm="ngForm"
          action="javascript:void(0)"
          novalidate>

      <panel [collapsible]="true" [collapsed]="true">

        <panel-heading>
          <h4>Change Password</h4>
        </panel-heading>

        <panel-body>
          <div class="col-md-12">
            <div class="form-group label-floating mt-n"
                 [ngClass]="{'has-error': (oldPassword.invalid && (oldPassword.touched || oldPassword.dirty)) }">
              <label for="oldPassword" class="control-label">Current Password</label>
              <input type="password"
                     name="oldPassword"
                     class="form-control"
                     #oldPassword="ngModel"
                     ngModel
                     required/>

              <div *ngIf="oldPassword.invalid && (oldPassword.touched || oldPassword.dirty)">
                <p class="hint" [hidden]="!oldPassword.errors.required">Password is required.</p>
              </div>
              <p class="hint" [hidden]="!errors.password">{{errors.password}}</p>

            </div>
          </div>

          <div ngModelGroup="newPasswords" passwordMatcher #newPasswords="ngModelGroup">
            <div class="col-md-12">
              <div class="form-group label-floating mt-n"
                   [ngClass]="{'has-error': (newPassword.invalid && (newPassword.touched || newPassword.dirty)) }">
                <label for="newPassword" class="control-label">New Password</label>
                <input type="password"
                       name="newPassword"
                       class="form-control"
                       #newPassword="ngModel"
                       ngModel
                       minlength="6"
                       required/>

                <div *ngIf="newPassword.invalid && (newPassword.touched || newPassword.dirty)">
                  <p class="hint" [hidden]="!newPassword.errors.required">Password is required.</p>
                  <p class="hint" [hidden]="!newPassword.errors.minlength">Password must be at least 6 characters.</p>
                </div>

              </div>
            </div>

            <div class="col-md-12">
              <div class="form-group label-floating mt-n"
                   [ngClass]="{'has-error': (confirm.invalid && (confirm.touched || confirm.dirty)) }">

                <label for="confirm" class="control-label">Confirm Password</label>
                <input type="password"
                       class="form-control"
                       name="confirm"
                       #confirm="ngModel"
                       ngModel
                       required/>

                <div *ngIf="confirm.invalid && (confirm.touched || confirm.dirty)">
                  <p class="hint" [hidden]="!confirm.errors.required">Please confirm password.</p>
                </div>
                <div *ngIf="newPasswords.errors && newPasswords.invalid && (confirm.touched || confirm.dirty)">
                  <p class="hint" [hidden]="newPasswords.errors && !newPasswords.errors.nomatch">Passwords do not match.</p>
                </div>

              </div>
            </div>
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
export class PasswordComponent implements OnInit {

  isLoading: boolean;
  success: boolean;
  errors: any = {};

  constructor(
    private auth: AuthService,
    private modal: ModalService,
  ) {
  }

  ngOnInit() {
  }

  onSubmit(form) {
    if (form.invalid) return;
    this.errors.password = '';
    this.isLoading = true;
    this.success = false;

    this.auth.updatePassword(form.value.oldPassword,
      form.value.newPasswords.newPassword).pipe(
      first())
      .subscribe(
        () => {
          this.isLoading = false;
          this.success = true;
        },
        err => {
          this.isLoading = false;
          if (err.status === 403) {
            this.errors.password = 'Password is incorrect.';
            return;
          }
          this.modal.error();
        },
      )
  }


}
