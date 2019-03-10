import { FormGroup } from '@angular/forms';
import { PersonalLinksFormComponent } from 'app/components/forms/personal-links-form/personal-links-form.component';
import { first } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'settings-social',
  template: `
      <panel #panel [collapsible]="true" [collapsed]="true">

        <panel-heading>
          <h4>Web Presence</h4>
        </panel-heading>

        <panel-body>
          <div class="col-xs-12">
            <p class="subtext mb-lg">
              Provide valid URL so others can find you on other social media.
            </p>

            <home-personal-links-form [form]="socialForm"></home-personal-links-form>
          </div>
        </panel-body>

        <panel-footer>
          <home-btn
            [class]="'btn btn-info btn-sm pull-right mt-n'"
            (click)="onSubmit(socialForm)"
            [isLoading]="isLoading">
            Save
          </home-btn>

          <div class="pull-right" *ngIf="success">
            <success-icon></success-icon>
          </div>
        </panel-footer>
      </panel>
  `,
  styles: []
})
export class SocialComponent implements OnInit {
  member = new User();

  isLoading: boolean;
  success: boolean;
  socialForm: FormGroup;

  @ViewChild('panel') panel;

  constructor(
    private auth: AuthService,
    private modal: ModalService,
  ) {
    this.socialForm = PersonalLinksFormComponent.build();
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe(u => {
        this.member = u;
        this.socialForm.patchValue(u.personal_links);
      });
  }

  onSubmit(form) {

    if (form.invalid) return;
    this.isLoading = true;
    this.success = false;

    const personal_links = Object.keys(form.value)
      .filter(k => !!form.value[k])
      .reduce((agg, k) => ({ ...agg, [k]: form.value[k] }), {});

    this.auth.updateAccount({ personal_links }).pipe(
      first())
      .subscribe(
        () => {
          this.success = true;
          this.isLoading = false;
        },
        err => {
          console.error(err);
          this.isLoading = false;
          this.modal.error();
        },
      );
  }

}
