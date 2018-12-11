import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NavEffects } from 'app/core/nav/nav.effects';
import { NavService } from 'app/core/nav/nav.service';
import * as fromNav from './reducers/nav.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('nav', fromNav.reducer),
    EffectsModule.forFeature([NavEffects]),
  ],
  providers: [NavService],
  declarations: []
})
export class NavModule {
}
