import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeleteDiscountModalComponent } from 'app/main/discounts/delete-discount-modal.component';
import { EditDiscountModalComponent } from 'app/main/discounts/edit-discount-modal/edit-discount-modal.component';

import { StoreModule } from '@ngrx/store';
import * as fromDiscounts from './reducers/discount.reducer';
import { EffectsModule } from '@ngrx/effects';
import { DiscountEffects } from './effects/discount.effects';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'app/shared/shared.module';

import { DiscountsComponent } from './discounts.component';
import { DiscountComponent } from './discount/discount.component';
import { DiscountService } from './discount.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: DiscountsComponent }]),
    ReactiveFormsModule,
    StoreModule.forFeature('discounts', fromDiscounts.reducer),
    EffectsModule.forFeature([DiscountEffects]),
  ],
  declarations: [
    DiscountsComponent,
    DiscountComponent,
    EditDiscountModalComponent,
    DeleteDiscountModalComponent
  ],
  entryComponents: [
    EditDiscountModalComponent,
    DeleteDiscountModalComponent
  ],
  providers: [DiscountService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class DiscountsModule {
}
