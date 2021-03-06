import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeFormsModule } from 'app/components/forms/home-forms.module';
import { DoneComponent } from 'app/registration/done.component';
import { SharedModule } from 'app/shared/shared.module';
import { localStorageSync } from 'ngrx-store-localstorage';
import { RegistrationComponent } from './registration.component';
import { ContactComponent } from './contact/contact.component';
import { ActionReducer, StoreModule } from '@ngrx/store';
import * as fromRegistration from './registration.reducer';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AboutComponent } from './about/about.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup.component';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return localStorageSync({
    keys: ['userId', 'contact', 'about', 'subscription', 'profile'],
    rehydrate: true,
    removeOnUndefined: true,
  })(reducer);
}

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: '', component: SignupComponent },
      { path: ':step', component: RegistrationComponent },
    ]),
    HomeFormsModule,
    StoreModule.forFeature('registration', fromRegistration.reducer, { metaReducers: [localStorageSyncReducer] }),
  ],
  declarations: [
    RegistrationComponent,
    ContactComponent,
    SubscriptionComponent,
    AboutComponent,
    ProfileComponent,
    DoneComponent,
    SignupComponent,
  ],
})
export class RegistrationModule { }
