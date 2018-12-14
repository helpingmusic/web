import { first } from 'rxjs/operators';
import { AfterViewInit, Component, ErrorHandler, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'home-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy, AfterViewInit {
  errorMessage: string;
  isLoading: boolean;

  subscriptions: any = {};

  constructor(
    private auth: AuthService,
    private router: Router,
    private modal: ModalService,
    private http: HttpClient,
    private errorReporter: ErrorHandler
  ) {
  }

  ngOnInit() {
    this.auth.isLoggedIn().pipe(
      first())
      .subscribe(is => {
        if (is) this.router.navigate(['']);
      });
  }

  ngAfterViewInit() {
    $.material.init('home-login *');
    setTimeout(() => {
      const input = (<any>document.querySelector('home-login input[autofocus]'));
      if (input) input.focus();
    }, 1000);
  }

  ngOnDestroy() {
    if (this.subscriptions.login) this.subscriptions.login.unsubscribe();
  }

  onSubmit(form) {

    if (form.invalid) return;
    this.isLoading = true;

    this.subscriptions.login = this.auth.login(form.value.email, form.value.password)
      .subscribe(
        () => {
          this.errorMessage = null;
          this.router.navigate(['']);
        },
        err => {
          this.isLoading = false;
          if (err.statusText === 'Unauthorized') {
            this.errorMessage = 'Email or password was incorrect.';
          } else {
            this.errorMessage = 'Something went wrong.';
            this.errorReporter.handleError(err);
          }
        }
      );
  }

  forgotPassword() {
    this.modal.popup({
      title: 'Forgot Password',
      text: 'Enter your email and we\'ll email you a link to reset your password',
      input: 'email',
      inputPlaceholder: 'Email',
      closeOnConfirm: false,
    })
      .then(email => {
        if (!email) return;

        this.http.post<any>('/password-reset', { email })
          .subscribe(
            res => {
              this.modal.popup({
                type: 'success',
                title: 'Success',
                text: 'Check your email for a link to reset your password',
              });
            },
            async (err) => {
              console.log(err);
              await this.modal.error({ text: err.error });
              return this.forgotPassword();
            },
          );
      });
  }
}
