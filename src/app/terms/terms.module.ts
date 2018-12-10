import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { TermsComponent } from './terms.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: TermsComponent }]),
  ],
  declarations: [TermsComponent]
})
export class TermsModule {
}
