import { NgModule } from '@angular/core';
import { PostComponent } from './post.component';
import { SharedModule } from 'app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { PostModule as PostComponentModule } from 'app/components/post/post.module';

console.log('post module');

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([
      { path: ':id', component: PostComponent },
    ]),
    PostComponentModule,
  ],
  declarations: [PostComponent]
})
export class PostModule {
}
