import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { NewRegistration, StepCompletion } from 'app/registration/registration.actions';
import { User } from 'models/user';
import { first, throttleTime, withLatestFrom } from 'rxjs/operators';
import * as fromRegistration from './registration.reducer';

@Component({
  selector: 'home-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit, AfterViewInit {

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  walkthrough: FormGroup;

  steps = [
    'contact',
    'subscription',
    'about',
    'profile',
    'done',
  ];

  constructor(
    fb: FormBuilder,
    private store: Store<fromRegistration.State>,
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private auth: AuthService,
  ) {
    this.walkthrough = fb.group({
      contact: [false, val.requiredTrue],
      subscription: [false, val.requiredTrue],
      about: [false, val.requiredTrue],
      profile: [false, val.requiredTrue],
      done: [false, val.requiredTrue],
    });
  }

  showStep(step: any) {
    return this.stepper.selected === step || this.stepper.selected === null;
  }

  ngAfterViewInit() {
    this.store.pipe(select(fromRegistration.selectRegistrationStepValidity))
      .pipe(throttleTime(200))
      .subscribe(v => {
        console.log(v);
        this.walkthrough.setValue(v);

        // setTimeout(() => {
        Object.keys(v)
          .forEach(k => this.stepper.steps.find(s => s.state === k).completed = v[k]);
        // }, 10);

        if (v.done) return this.router.navigateByUrl('/members/me');
      });

  }

  ngOnInit() {
    // load step from route
    this.route.paramMap.subscribe(params => {
      const step = params.get('step');
      this.stepper.selectedIndex = isFinite(+step) ? parseInt(step) : this.steps.indexOf(step);
    });

    this.auth.getCurrentUser()
      .pipe(
        withLatestFrom(this.store.pipe(select(fromRegistration.selectRegistrationUserId))),
        first(),
      )
      .subscribe(([u, registrationUserId]: [User, string]) => {

        if (registrationUserId !== u._id) {
          this.store.dispatch(new NewRegistration({ userId: u._id }));
        }

        let index = 0;
        if (u.email) index = 1;
        if (u.stripe && u.stripe.subscriptionId) index = 2;
        if (u.membership_types.length > 0) index = 3;
        if (u.profile_pic) index = 4;

        console.log(u);
        console.log(index);

        this.router.navigate(['/register', this.steps[index]]);
        // this.stepper.selectedIndex = index;
      })
  }

  updateRoute(e: any) {
    this.router.navigate(['/register', e.selectedStep.state]);
  }

  stepCompleted(step: string) {
    this.store.dispatch(new StepCompletion({ step }));
    const next = this.steps.indexOf(step) + 1;
    this.router.navigate(['/register', this.steps[next]]);
  }

}
