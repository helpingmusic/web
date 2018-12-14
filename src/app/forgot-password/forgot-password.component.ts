import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'home-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean;

  private token: string;
  private resetId: string;

  resetForm: FormGroup;

  constructor(
    private auth: AuthService,
    private modal: ModalService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
  ) {
    this.route.queryParams
      .pipe(first())
      .subscribe((p: Params) => this.token = p.token);
    this.route.params
      .pipe(first())
      .subscribe((p: Params) => this.resetId = p.id);

    this.resetForm = fb.group({
      password: ['', [val.minLength(6), val.maxLength(32), val.required]],
      passwordConfirm: ['', [val.required]]
    }, {
      // for password confirm
      validators: (fg: FormGroup) => {
        return fg.get('password').value === fg.get('passwordConfirm').value
          ? null : { notSame: true };
      }
    });
  }

  ngOnInit() {
  }

  onSubmit(form) {

    console.log(form);

    if (form.invalid) return;

    this.isLoading = true;
    const password = form.value.password;

    this.auth.resetPassword(
      this.resetId, this.token, password,
    )
      .pipe(first())
      .subscribe(
        () => {
          this.modal.popup({
            type: 'success',
            title: 'Success',
            text: 'Your password has been reset.',
            confirmButtonText: 'Login',
            showCancelButton: false,
          })
            .then(() => this.router.navigate(['/login']));
        },
        res => {
          this.isLoading = false;
          this.modal.error({
            text: res.error.message,
          });
        }
      );

  }

}
