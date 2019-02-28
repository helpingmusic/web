import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MatHorizontalStepper } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { StepCompletion } from 'app/registration/registration.actions';
import { User } from 'models/user';
import { first, throttleTime } from 'rxjs/operators';
import * as fromRegistration from './registration.reducer';

@Component({
  selector: 'home-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  walkthrough: FormGroup;

  selected = 0;

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

  ngOnInit() {
    // load step from route
    this.route.paramMap.subscribe(params => {
      const step = params.get('step');
      const index = isFinite(+step) ? parseInt(step) : this.steps.indexOf(step);
      console.log('set from route', step, index);
      this.stepper.selectedIndex = index;
      // this.selected = index;
    });

    this.store.pipe(select(fromRegistration.selectRegistrationStepValidity))
      .pipe(throttleTime(200))
      .subscribe(v => {
        this.walkthrough.setValue(v);

        setTimeout(() => {
          Object.keys(v)
            .forEach(k => this.stepper.steps.find(s => s.state === k).completed = v[k]);
        }, 10);

        if (v.done) return this.router.navigateByUrl('/members/me');
      });

    this.auth.getCurrentUser()
      .pipe(first())
      .subscribe((u: User) => {
        let index = 0;
        if (u.email) index = 1;
        if (u.stripe && u.stripe.tier) index = 2;
        if (u.membership_types.length > 0) index = 3;
        if (u.profile_pic) index = 4;

        console.log('set from user', index);
        this.selected = index;
        // this.stepper.selectedIndex = index;
      })
  }

  updateRoute(e: any) {
    console.log('update route', e);
    this.router.navigate(['/register', e.selectedStep.state]);
    // this.location.go(`./register/${e.selectedStep.state}`);
  }

  stepCompleted(step: string) {
    this.store.dispatch(new StepCompletion({ step }));
    console.log('complete', step);
    // this.selected++;
    this.stepper.next();
  }

}
