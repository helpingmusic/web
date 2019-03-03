import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanRegisterGuard } from 'app/core/auth/can-register.guard';
import { CanResetPasswordGuard } from 'app/core/auth/can-reset-password.guard';
import { IsActiveGuard } from 'app/core/auth/is-active.guard';
import { IsAdminGuard } from 'app/core/auth/is-admin.guard';

import { IsMemberGuard } from 'app/core/auth/is-member.guard';
import { TierGuard } from 'app/core/auth/tier.guard';
import { LogoutGuard } from 'app/logout.guard';

import { MainComponent } from 'app/main/main.component';
import { MAIN_ROUTES } from 'app/main/main.routes';
import { RerouteGuard } from 'app/reroute.guard';

const routes: Routes = [
  // public
  {
    path: 'login',
    loadChildren: './login/login.module#LoginModule',
    data: { title: 'Login' }
  },
  {
    path: 'signup',
    redirectTo: 'register',
  },
  {
    path: 'register',
    loadChildren: './registration/registration.module#RegistrationModule',
    data: { title: 'Register' }
  },
  {
    path: 'walkthrough',
    redirectTo: 'register',
    pathMatch: 'full',
  },
  {
    path: 'privacy-policy',
    loadChildren: './privacy/privacy.module#PrivacyModule',
    data: { title: 'Privacy Policy' }
  },
  {
    path: 'terms',
    loadChildren: './terms/terms.module#TermsModule',
    data: { title: 'Membership Terms Of Agreement' }
  },

  {
    path: 'forgot',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule',
    data: { title: 'Reset Password' },
  },
  {
    path: 'logout',
    canActivate: [LogoutGuard],
    children: [],
  },

  // Main
  {
    path: 'app',
    canActivate: [IsMemberGuard],
    component: MainComponent,
    children: MAIN_ROUTES,
  },

  { path: '**', canActivate: [RerouteGuard], children: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    IsMemberGuard,
    CanRegisterGuard,
    CanResetPasswordGuard,
    IsActiveGuard,
    IsAdminGuard,
    TierGuard,
  ],
})
export class AppRoutingModule {
}
