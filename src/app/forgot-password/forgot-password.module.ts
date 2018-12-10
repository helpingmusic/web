import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: ForgotPasswordComponent }])
  ],
  declarations: [ForgotPasswordComponent]
})
export class ForgotPasswordModule {
}
