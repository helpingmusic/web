import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([{ path: ':id', component: ForgotPasswordComponent }])
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
