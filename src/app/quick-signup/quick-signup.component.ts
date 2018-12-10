import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ModalService } from 'app/core/modal.service';
import { User } from 'models/user';
import { brands } from './brands';

@Component({
  selector: 'home-quick-signup',
  templateUrl: './quick-signup.component.html',
  styleUrls: ['./quick-signup.component.scss']
})
export class QuickSignupComponent implements OnInit {

  brand: any;

  isLoading: boolean;
  errors: any = {};
  // Have array so it can be exponential
  possibleCommitAmounts = [0, 5, 10, 25, 50, 75, 100, 150, 200, 250, 300, 400, 500, 750, 1000]
  amountToCommit = 150;
  commitIndex = this.possibleCommitAmounts.indexOf(15000);
  showOtherAmount: boolean;
  @ViewChild('otherAmountInput') otherAmountInput: any;

  constructor(
    private http: HttpClient,
    private modal: ModalService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.params.subscribe(({ brand }) => {
      console.log(brand);
      this.brand = brands[brand || 'home'];
      this.amountToCommit = this.brand.defaultAmount;
    });
  }

  updateAmount(e) {
    this.amountToCommit = this.possibleCommitAmounts[+e.target.value];
  }

  showAmountInput() {
    if (this.brand.canEditAmount) {
      this.showOtherAmount = true;
      this.otherAmountInput.nativeElement.focus();
    }
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;
    this.isLoading = true;
    this.errors = {};

    this.http.post('/users/quick-signup', {
      email: form.value.email,
      referredBy: this.brand.name,
      amountToCommit: this.amountToCommit * 100,
      token: form.value.token.id,
    })
      .subscribe(
        (user: User) => {
          this.isLoading = false;

          this.modal.popup({
            type: 'success',
            title: 'Welcome H.O.M.E.!',
            text: `You can expect an email at ${user.email} with a link to finish signing up.`,
            showCancelButton: false,
          })
            .then(() => window.location.reload());
        },
        res => {
          this.isLoading = false;
          const e = JSON.parse(res.error);

          if (e.type === 'StripeCardError') {
            return this.errors.token = e.message;
          }

          Object.keys(e.errors)
            .forEach(k => this.errors[k] = e.errors[k].message)
        }
      )
  }

}
