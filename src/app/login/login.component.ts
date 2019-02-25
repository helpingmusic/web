import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
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
export class LoginComponent implements OnInit {
  isLoading: boolean;
  loginForm: FormGroup;

  constructor(
    private auth: AuthService,
    private router: Router,
    private modal: ModalService,
    private http: HttpClient,
    private errorReporter: ErrorHandler,
    private fb: FormBuilder,
  ) {
    this.loginForm = fb.group({
      email: ['', [val.required, val.email]],
      password: ['', [val.required]]
    });
  }

  ngOnInit() {
    this.auth.isLoggedIn().pipe(first())
      .subscribe(is => is && this.router.navigate(['']));

    this.loginForm.valueChanges
      .subscribe(() => {
        const { errors } = this.loginForm.get('email');
        if (!errors) return;
        delete errors.server;
        if (Object.keys(errors).length === 0) this.loginForm.get('email').setErrors(null);
      })
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return;
    this.isLoading = true;

    this.auth.login(form.value.email, form.value.password)
      .subscribe(
        () => {
          return this.router.navigate(['']);
        },
        err => {
          this.loginForm.get('email').setErrors({
            server: err.statusText === 'Unauthorized' ? 'Email or password was incorrect.' : 'Something went wrong.',
          })
        },
        () => this.isLoading = false,
      );
  }

  forgotPassword() {
    this.modal.popup({
      title: 'Forgot Password',
      text: 'Enter your email and we\'ll email you a link to reset your password',
      input: 'email',
      inputPlaceholder: 'Email',
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
