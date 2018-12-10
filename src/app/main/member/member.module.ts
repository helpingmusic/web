import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MemberRoutes } from './member.routes';
import { MemberResolver } from './member.resolver';
import { IsOwnAccountGuard } from 'app/core/auth/is-own-account.guard';

import { MemberComponent } from './member.component';
import { ProfileComponent } from './profile/profile.component';
import { BillingComponent } from './billing/billing.component';
import { InvoiceService } from 'app/main/member/billing/invoice.service';
import { InvoiceSummaryComponent } from './billing/invoice-summary.component';
import { UploadPhotoModalComponent } from './upload-photo-modal/upload-photo-modal.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(MemberRoutes)
  ],
  declarations: [
    MemberComponent,
    ProfileComponent,
    BillingComponent,
    InvoiceSummaryComponent,
    UploadPhotoModalComponent
  ],
  entryComponents: [
    UploadPhotoModalComponent,
  ],
  providers: [
    MemberResolver,
    IsOwnAccountGuard,
    InvoiceService,
  ]
})
export class MemberModule {
}
