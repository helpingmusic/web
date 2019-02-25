import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ModalService } from 'app/core/modal.service';
import { User } from 'models/user';
import { AuthService } from 'app/core/auth/auth.service';

@Component({
  selector: 'home-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit {
  member = new User();
  errors: any = {};

  @ViewChild('billing') billingSettings;
  @ViewChild('contact') contactSettings;
  @ViewChild('membershipTypes') membershipTypesSettings;
  @ViewChild('about') aboutSettings;
  @ViewChild('social') socialSettings;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private modal: ModalService,
  ) {
  }

  ngOnInit() {

    this.auth.getCurrentUser()
      .subscribe(u => this.member = u);

    this.route.queryParams.subscribe((params: Params) => {
      const confirmed = params['confirmEmail'] === 'true';
      if (confirmed) {
        this.modal.popup({
          type: 'success',
          title: 'Email Confirmed!',
          text: 'Just finish building your profile if you haven\'t done so already.'
        });
      }
    });

  }

  ngAfterViewInit() {

  }


}

