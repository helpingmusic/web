import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'app/core/auth/auth.service';
import { NewRegistration } from 'app/registration/registration.actions';
import { User } from 'models/user';
import { first } from 'rxjs/operators';
import * as fromRegistration from './registration.reducer';

@Component({
  selector: 'home-signup',
  template: `
    <div class="container blank-container">
      <div class="signup-block pt-xl">
        <div class="row text-center">
          <div class="col-md-12">
            <a href="http://evolvemusic.org" class="inblock">
              <img alt="H.O.M.E." width="200" src="assets/images/home-login-logo.png"/>
            </a>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-md-8">
            <home-contact (completed)="onComplete()" 
                          [isRegistrationStep]="false"></home-contact>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router,
    private store: Store<fromRegistration.State>,
    private auth: AuthService,
  ) { }

  ngOnInit() {
  }

  onComplete() {
    this.auth.getCurrentUser()
      .pipe(first())
      .subscribe((u: User) => {
        this.store.dispatch(new NewRegistration({ userId: u._id }));
        return this.router.navigateByUrl('/register/subscription');
      })

  }

}
