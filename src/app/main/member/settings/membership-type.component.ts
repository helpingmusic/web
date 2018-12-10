import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { membershipTypes } from 'app/globals';
import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'settings-membership-type',
  template: `
    <form (ngSubmit)="onSubmit(typeForm)"
          novalidate
          [formGroup]="typeForm"
          action="javascript:void(0)">

      <panel #panel [collapsible]="true" [collapsed]="true">

        <panel-heading>
          <h4>Membership Types</h4>
        </panel-heading>

        <panel-body>

          <div class="col-xs-12">
            <p class="subtext">
              This is how your account will be recognized when someone is searching for a certain type
              of community member. You may select more than one.
            </p>

            <div class=" col-sm-6" *ngFor="let t of membershipTypes; let i=index">
              <div class="checkbox m-n">
                <label>
                  <input type="checkbox"
                         [formControl]="typeForm.controls['membershipTypes'].controls[i]"
                         value="{{t.name}}"
                  />
                  <h5 class="inblock">{{t.name | pretty}}</h5>
                  <p class="subtext">{{t.description}}</p>
                </label>
              </div>

            </div>

            <div class="clear text-center" *ngIf="typeForm.get('membershipTypes').invalid && submitted">
              <p class="hint" [hidden]="!typeForm.get('membershipTypes').errors.required">You must select at least one membership type.</p>
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
export class MembershipTypeComponent implements OnInit {
  typeForm: FormGroup;
  member = new User();
  membershipTypes = membershipTypes;

  isLoading: boolean;
  submitted: boolean;
  success: boolean;

  @ViewChild('panel') panel;

  constructor(
    private auth: AuthService,
    private modal: ModalService,
    private fb: FormBuilder,
  ) {
    this.typeForm = fb.group({
      membershipTypes: fb.array(
        [false, false, false, false, false],
        function (control: AbstractControl): any {
          // Include at least one true value;
          return control.value.filter(
            v => v).length ? null : { 'required': true };
        }
      ),
    });
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.member = u;
        this.typeForm.controls.membershipTypes.patchValue(
          this.membershipTypes.map(
            t => u.membership_types.indexOf(t.name) !== -1)
        );
      });
  }

  triggerSubmit() {
    this.onSubmit(this.typeForm);
  }

  onSubmit(form) {
    this.submitted = true;

    if (form.invalid) return;

    this.isLoading = true;
    this.success = false;

    let userMembershipTypes = form.value.membershipTypes
      .map((t, i) => t ? this.membershipTypes[i].name : null)
      .filter(t => t);

    this.auth.updateAccount({ membership_types: userMembershipTypes }).pipe(
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


}
