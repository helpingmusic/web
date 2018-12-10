import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PostModule } from 'app/components/post/post.module';

import { NewsfeedComponent } from './newsfeed.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    PostModule,
    RouterModule.forChild([{ path: '', component: NewsfeedComponent }]),
  ],
  declarations: [NewsfeedComponent],
})
export class NewsfeedModule {
}

