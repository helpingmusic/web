import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { QuickSignupComponent } from 'app/quick-signup/quick-signup.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: QuickSignupComponent },
      { path: ':brand', component: QuickSignupComponent }
    ])
  ],
  declarations: [
    QuickSignupComponent
  ]
})
export class QuickSignupModule {
}
