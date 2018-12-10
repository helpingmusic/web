import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { RightNavComponent } from './right-nav.component';
import { NotificationsPaneComponent } from './notifications-pane/notifications-pane.component';
import { NotificationsComponent } from './notifications-pane/notifications/notifications.component';
import { SettingsComponent } from './notifications-pane/settings/settings.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { CartResolver } from './checkout/cart-resolver.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule
  ],
  declarations: [
    RightNavComponent,
    NotificationsPaneComponent,
    NotificationsComponent,
    SettingsComponent,
    CheckoutComponent,
  ],
  exports: [
    RightNavComponent,
    NotificationsPaneComponent,
    NotificationsComponent,
    SettingsComponent,
  ],
  providers: [
    CartResolver
  ],
})
export class RightNavModule {
}
