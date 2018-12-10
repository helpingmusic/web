import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from 'models/user';
import { AuthService } from 'app/core/auth/auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'home-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit, AfterViewInit, OnDestroy {
  isLoading: boolean;
  errorMessage: string;
  subscriptions: any = {};
  submitted: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    $.material.init('home-signup *');
    setTimeout(() => {
      const input = (<any>document.querySelector('home-signup input[autofocus]'));
      if (input) input.focus();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.subscriptions.signup) this.subscriptions.signup.unsubscribe();
  }

  onSubmit(form) {
    this.submitted = true;

    if (!form.valid) return;

    this.errorMessage = null;
    this.isLoading = true;

    const u = Object.assign({}, form.value, {
      password: form.value.passwords.password
    });
    delete u.passwords;

    this.subscriptions.signup = this.auth.signup(u)
      .pipe(first())
      .subscribe(
        (u: User) => {
          this.router.navigate(['walkthrough', '2']);
        },
        err => {
          console.log(err);
          const errors = JSON.parse(err.error).errors;
          for (let e in errors) {
            if (!errors.hasOwnProperty(e)) return;
            this.errorMessage = errors[e].message;
          }
          this.isLoading = false;
        }
      );

  }

}
