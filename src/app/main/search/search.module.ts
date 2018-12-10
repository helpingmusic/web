import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { SearchComponent } from './search.component';
import { UserService } from 'app/core/user/user.service';
import { SearchResultComponent } from './search-result/search-result.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: SearchComponent }])
  ],
  declarations: [SearchComponent, SearchResultComponent],
  providers: [UserService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class SearchModule {
}
