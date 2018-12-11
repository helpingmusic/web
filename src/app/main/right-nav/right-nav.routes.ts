import { Routes } from '@angular/router';

import { NotificationsPaneComponent } from './notifications-pane/notifications-pane.component';
import { NotificationsComponent } from './notifications-pane/notifications/notifications.component';
import { SettingsComponent } from './notifications-pane/settings/settings.component';
import { CheckoutComponent } from 'app/main/right-nav/checkout/checkout.component';
import { CartResolver } from 'app/main/right-nav/checkout/cart-resolver.service';

export const RIGHT_NAV_ROUTES: Routes = [
  {
    path: 'notifications',
    component: NotificationsPaneComponent,
    children: [
      { path: 'unread', component: NotificationsComponent },
      { path: 'settings', component: SettingsComponent },
      { path: '**', redirectTo: 'unread', pathMatch: 'full' }
   ],
    outlet: 's'
  },

  {
    path: 'checkout',
    component: CheckoutComponent,
    outlet: 's',
    resolve: {
      cart: CartResolver,
    }
  }

];
