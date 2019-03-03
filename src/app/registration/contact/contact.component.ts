import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { fieldMatcher } from 'app/components/forms/match.validator';
import { AuthService } from 'app/core/auth/auth.service';
import { StepUpdate } from 'app/registration/registration.actions';
import { WalkthroughStep } from 'app/registration/walkthrough-step';
import { User } from 'models/user';
import { filter, finalize, first, pluck, tap } from 'rxjs/operators';
import { selectRegistrationState } from '../registration.reducer';
import * as fromRegistration from '../registration.reducer';

export interface ContactForm {
  firstName: string;
  lastName: string;
  email: string;
  acceptTerms: string;
}

@Component({
  selector: 'home-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, WalkthroughStep<ContactForm> {

  @Input() isRegistrationStep: boolean;
  @Output() completed = new EventEmitter<ContactForm>();

  isLoading: boolean;
  submitted: boolean;
  contactForm: FormGroup;

  constructor(
    private router: Router,
    private auth: AuthService,
    private fb: FormBuilder,
    private store: Store<fromRegistration.State>
  ) {
    this.contactForm = fb.group({
      firstName: ['', [val.required]],
      lastName: ['', [val.required]],
      email: ['', [val.required, val.email]],
      password: ['', [val.required, val.minLength(6)]],
      passwordConfirm: ['', [val.required]],
      acceptTerms: [false, [val.requiredTrue]],
    }, {
      validators: [fieldMatcher('password', 'passwordConfirm')]
    })
  }

  ngOnInit() {
    if (this.isRegistrationStep) {
      this.watchForm();
    }
  }

  watchForm() {
    this.store.pipe(
      first(),
      select(selectRegistrationState),
      pluck('contact'),
      filter(val => !!val)
    )
      .subscribe(val => this.contactForm.patchValue(val, { emitEvent: true }));

    this.contactForm.valueChanges
      .subscribe(data => {
        this.store.dispatch(new StepUpdate({
          step: 'contact',
          data: {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            acceptTerms: data.acceptTerms,
          },
        }))
      })
  }

  onSubmit(form) {
    this.submitted = true;
    if (!form.valid) return;
    this.isLoading = true;

    this.auth.signup({
      ...form.value,
      first_name: form.value.firstName,
      last_name: form.value.lastName,
    })
      .pipe(
        first(),
        finalize(() => this.isLoading = false),
      )
      .subscribe(
        (u: User) => this.completed.emit(),
        ({ error }) => {
          console.log(error);
          this.contactForm.get(error.field).setErrors({ server: error.message });
          this.contactForm.get(error.field).markAsTouched();
        }
      );

  }
}
