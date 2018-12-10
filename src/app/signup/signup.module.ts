import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';

import { SignupComponent } from './signup.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: SignupComponent }]),
  ],
  declarations: [SignupComponent]
})
export class SignupModule {
}
