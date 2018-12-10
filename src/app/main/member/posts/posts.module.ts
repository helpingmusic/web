import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PostModule as PostComponentModule } from 'app/components/post/post.module';
import { SharedModule } from 'app/shared/shared.module';
import { PostsComponent } from './posts.component';
import { PostService } from 'app/core/post/post.service';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: PostsComponent }]),
    PostComponentModule,
  ],
  declarations: [PostsComponent],
  providers: [PostService],
})
export class PostsModule {
}
