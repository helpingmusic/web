import { Routes } from '@angular/router';

import { IsOwnAccountGuard } from 'app/core/auth/is-own-account.guard';

import { MemberComponent } from './member.component';
import { ProfileComponent } from './profile/profile.component';
import { MemberResolver } from './member.resolver';
import { BillingComponent } from 'app/main/member/billing/billing.component';

export const MemberRoutes: Routes = [
  { path: '', redirectTo: 'me', pathMatch: 'exact' },
  {
    path: ':id',
    component: MemberComponent,
    resolve: {
      member: MemberResolver,
    },

    children: [
      { path: '', component: ProfileComponent, data: { title: 'About' } },
      {
        path: 'posts',
        loadChildren: 'app/main/member/posts/posts.module#PostsModule',
        data: { title: 'Member Posts' }
      },
      {
        path: 'reviews',
        loadChildren: 'app/main/member/reviews/reviews.module#ReviewsModule',
        data: { title: 'Member Reviews' }
      },
      {
        path: 'music',
        loadChildren: 'app/main/member/music/music.module#MusicModule',
        data: { title: 'Member Music' }
      },

      {
        path: 'billing',
        canActivate: [IsOwnAccountGuard],
        component: BillingComponent,
        data: { title: 'Invoices' }
      },
      {
        path: 'settings',
        canActivate: [IsOwnAccountGuard],
        loadChildren: 'app/main/member/settings/settings.module#SettingsModule',
        data: { title: 'Member Settings' }
      },

    ]
  }
]
