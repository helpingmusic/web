import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';

@Component({
  selector: 'home-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, AfterViewInit {
  isLoading: boolean;
  private userId: string;

  subscriptions: any = {};

  constructor(
    private auth: AuthService,
    private modal: ModalService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.queryParams
      .subscribe((p: Params) => {
        this.userId = p.id;
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptions.reset) this.subscriptions.reset.unsubscribe();
  }

  ngAfterViewInit() {
    $.material.init('home-forgot-password *');
    setTimeout(() => (<any>document.querySelector(
      'home-forgot-password input[autofocus]')).focus(), 1000);
  }

  onSubmit(form) {

    if (form.invalid) return;

    this.isLoading = true;
    const p = form.value.passwords.password;

    this.subscriptions.reset = this.auth.resetPassword({
      password: p,
      _id: this.userId
    })
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
        e => this.modal.error(),
      );

  }

}
