import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { BookablesComponent } from './bookables/bookables.component';
import { BookableService } from './bookable.service';
import { BookComponent } from './book/book.component';
import { BookableResolver } from './bookable.resolver';
import { SessionsComponent } from './sessions.component';
import { SessionSummaryComponent } from './session-summary.component';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: SessionsComponent },
      { path: 'studios', component: BookablesComponent },
      {
        path: 'studios/:studio',
        component: BookComponent,
        resolve: { studio: BookableResolver }
      },
    ])
  ],
  declarations: [
    BookablesComponent,
    BookComponent,
    SessionsComponent,
    SessionSummaryComponent
  ],
  providers: [
    BookableService,
    BookableResolver
  ]
})
export class SessionsModule {
}
