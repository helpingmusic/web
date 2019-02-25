import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { StepUpdate } from 'app/registration/registration.actions';
import { WalkthroughStep } from 'app/registration/walkthrough-step';
import { filter, first, pluck, tap } from 'rxjs/operators';
import { membershipTypes } from 'app/globals';
import * as fromRegistration from '../registration.reducer';

export interface AboutForm {
  profession: string;
  phoneNumber: string;
  city: string;
  state: string;
  bio: string;
  membershipTypes: string[]
}

@Component({
  selector: 'home-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit, WalkthroughStep<AboutForm> {

  @Output() completed = new EventEmitter<AboutForm>();

  isLoading: boolean;
  submitted: boolean;
  aboutForm: FormGroup;
  membershipTypes = membershipTypes;

  constructor(
    fb: FormBuilder,
    private store: Store<fromRegistration.State>,
    private auth: AuthService,
  ) {
    this.aboutForm = fb.group({
      profession: ['', [val.required]],
      phoneNumber: ['', [val.required]],
      city: ['', [val.required]],
      state: ['', [val.required]],
      bio: ['', [val.required]],
      membershipTypes: fb.array(
        [false, false, false, false, false],
        (control: AbstractControl): any => (
          // Include at least one true value;
          control.value.some(v => v) ? null : { 'required': true }
        )
      ),
    })
  }

  ngOnInit() {
    this.watchForm();
  }

  watchForm() {
    this.store.pipe(
      first(),
      select(fromRegistration.selectRegistrationState),
      pluck('about'),
      filter(val => !!val),
    )
      .subscribe(val => this.aboutForm.patchValue(val, { emitEvent: true }));

    this.aboutForm.valueChanges
      .subscribe(data => {
        this.store.dispatch(new StepUpdate({ step: 'about', data }))
      })
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return;
    this.isLoading = true;

    const v = {
      ...form.value,
      membership_types: form.value.membershipTypes
        .map((t, i) => t ? this.membershipTypes[i].name : null)
        .filter(t => t),
    };

    this.auth.updateAccount(v).pipe(
      first()
    )
      .subscribe(
        () => this.completed.emit(),
        ({ error }) => {
          console.log(error);
          this.aboutForm.get(error.field).setErrors({ server: error.message });
          this.aboutForm.get(error.field).markAsTouched();
        },
        () => this.isLoading = false,
      );
  }



}
