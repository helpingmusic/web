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
          <div class="row">
            <div class="col-sm-4">
              <mat-form-field appearance="outline">
                <mat-label for="first_name">First Name</mat-label>
                <input type="text"
                       matInput
                       name="first_name"
                       required
                       [ngModel]="member.first_name"
                />
              </mat-form-field>
            </div>
            
            <div class="col-sm-4">
              <mat-form-field appearance="outline">
                <mat-label for="last_name">Last Name</mat-label>
                <input type="text"
                       matInput
                       name="last_name"
                       required
                       [ngModel]="member.last_name"
                />
              </mat-form-field>
            </div>
            
            <div class="col-sm-4">
              <mat-form-field appearance="outline">
                <mat-label for="email">Email</mat-label>
                <input type="email"
                       matInput
                       name="email"
                       required
                       [ngModel]="member.email"
                />
              </mat-form-field>
            </div>
          </div>

        </panel-body>

        <panel-footer>
          <home-btn
            [class]="'btn btn-info btn-sm mt-n'"
            [type]="'submit'"
            [isLoading]="isLoading">
            Save
          </home-btn>
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
