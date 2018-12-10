import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'settings-contact',
  template: `
    <form (ngSubmit)="onSubmit(contactForm)"
          #contactForm="ngForm"
          action="javascript:void(0)">

      <panel #panel [collapsible]="true" [collapsed]="true">

        <panel-heading>
          <h4>Contact</h4>
        </panel-heading>

        <panel-body>
          <div class="col-sm-4">
            <div class="form-group mt-n"
                 [ngClass]="{'has-error': contactForm.controls?.first_name?.errors }">
              <label for="first_name" class="control-label">First Name</label>
              <input type="text"
                     class="form-control"
                     name="first_name"
                     required
                     [ngModel]="member.first_name"
              />

            </div>
          </div>
          <div class="col-sm-4">
            <div class="form-group mt-n"
                 [ngClass]="{'has-error': contactForm.controls?.last_name?.errors }">
              <label for="last_name" class="control-label">Last Name</label>
              <input type="text"
                     class="form-control"
                     name="last_name"
                     required
                     [ngModel]="member.last_name"
              />

            </div>
          </div>

          <div class="col-sm-4">
            <div class="form-group mt-n"
                 [ngClass]="{'has-error': contactForm.controls?.email?.errors }">
              <label for="email" class="control-label">Email</label>
              <input type="email"
                     class="form-control"
                     name="email"
                     required
                     [ngModel]="member.email"
              />
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
export class ContactComponent implements OnInit {
  @ViewChild('contactForm') contactForm: any;
  member = new User();

  isLoading: boolean;
  success: boolean;

  @ViewChild('panel') panel;

  constructor(
    private auth: AuthService,
    private modal: ModalService,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => this.member = u);
  }

  triggerSubmit() {
    this.onSubmit(this.contactForm);
  }

  onSubmit(form) {
    if (form.invalid) return;

    this.isLoading = true;
    this.success = false;

    this.auth.updateAccount(form.value).pipe(
      first())
      .subscribe(
        () => {
          this.isLoading = false;
          this.success = true;
        },
        err => {
          this.isLoading = false;
          this.modal.error();
        },
      )
  }

}
