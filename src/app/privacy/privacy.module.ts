import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { PrivacyComponent } from './privacy.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: PrivacyComponent }]),
  ],
  declarations: [PrivacyComponent]
})
export class PrivacyModule {
}
