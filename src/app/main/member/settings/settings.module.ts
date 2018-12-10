import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HomeFormsModule } from 'app/components/forms/home-forms.module';

import { SharedModule } from 'app/shared/shared.module';
import { SettingsComponent } from './settings.component';

import { PasswordComponent } from './password.component';
import { ContactComponent } from './contact.component';
import { MembershipTypeComponent } from './membership-type.component';
import { AboutComponent } from './about.component';
import { SocialComponent } from './social.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    HomeFormsModule,
    RouterModule.forChild([{ path: '', component: SettingsComponent }])
  ],
  declarations: [
    SettingsComponent,
    PasswordComponent,
    ContactComponent,
    MembershipTypeComponent,
    AboutComponent,
    SocialComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SettingsModule {
}
