import { Routes } from '@angular/router';

import { RIGHT_NAV_ROUTES } from './right-nav/right-nav.routes';

import { IsActiveGuard } from 'app/core/auth/is-active.guard';
import { IsAdminGuard } from 'app/core/auth/is-admin.guard';

export const MAIN_ROUTES: Routes = [
  ...RIGHT_NAV_ROUTES,

  { path: '', redirectTo: 'announcements', pathMatch: 'full' },

  {
    path: 'announcements',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/announcements/announcements.module#AnnouncementsModule',
    data: { title: 'Announcements' },
  },
  // {
  //   path: 'events',
  //   canActivate: [IsActiveGuard],
  //   loadChildren: 'app/main/events/events.module#EventsModule',
  //   data: { title: 'Events' }
  // },
  {
    path: 'discounts',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/discounts/discounts.module#DiscountsModule',
    data: { title: 'Discounts' }
  },
  {
    path: 'member-content',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/member-content/member-content.module#MemberContentModule',
    data: { title: 'Member Content' }
  },
  {
    path: 'newsfeed',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/newsfeed/newsfeed.module#NewsfeedModule',
    data: { title: 'Newsfeed' }
  },
  {
    path: 'posts',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/post/post.module#PostModule',
    data: { title: 'Post' }
  },
  {
    path: 'directory',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/search/search.module#SearchModule',
    data: { title: 'Member Directory' }
  },
  {
    path: 'member',
    loadChildren: 'app/main/member/member.module#MemberModule',
    data: { title: 'Member' }
  },
  {
    path: 'my-sessions',
    canActivate: [IsActiveGuard],
    loadChildren: 'app/main/sessions/sessions.module#SessionsModule',
    data: {
      title: 'My Sessions',
    }
  },
  // {
  //   path: 'applications',
  //   loadChildren: 'app/main/contests/contests.module#ContestsModule',
  //   data: { title: 'Contests' }
  // },

  { path: '**', redirectTo: 'announcements', pathMatch: 'full' }
];
