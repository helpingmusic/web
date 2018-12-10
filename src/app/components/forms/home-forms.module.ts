import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalLinksFormComponent } from 'app/components/forms/personal-links-form/personal-links-form.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
  ],
  declarations: [PersonalLinksFormComponent],
  exports: [PersonalLinksFormComponent],
})
export class HomeFormsModule {
}
