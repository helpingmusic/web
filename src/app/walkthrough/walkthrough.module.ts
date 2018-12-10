import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeFormsModule } from 'app/components/forms/home-forms.module';

import { SharedModule } from 'app/shared/shared.module';
import { WalkthroughService } from 'app/walkthrough/walkthrough.service';
import { StepGuard } from './step.guard';
import { WalkthroughComponent } from './walkthrough.component';
import { AccountInfoComponent } from './account-info.component';
import { SubscriptionComponent } from './subscription.component';
import { AboutComponent } from './about.component';
import { DoneComponent } from './done.component';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HomeFormsModule,
    RouterModule.forChild([{
      path: '',
      component: WalkthroughComponent,
      canActivate: [StepGuard],
      children: [
        { path: '1', component: AccountInfoComponent },
        { path: '2', component: SubscriptionComponent, canActivate: [StepGuard] },
        { path: '3', component: AboutComponent, canActivate: [StepGuard] },
        { path: '4', component: ProfileComponent, canActivate: [StepGuard] },
        { path: '5', component: DoneComponent, canActivate: [StepGuard] },
        { path: '**', redirectTo: '', pathMatch: 'full' },
      ]
    }])
  ],
  declarations: [
    WalkthroughComponent,
    AccountInfoComponent,
    SubscriptionComponent,
    AboutComponent,
    DoneComponent,
    ProfileComponent,
  ],
  providers: [WalkthroughService, StepGuard],
})
export class WalkthroughModule {
}
