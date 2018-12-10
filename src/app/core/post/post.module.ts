import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PostEffects } from 'app/core/post/effects/post.effects';
import { PostService } from 'app/core/post/post.service';
import { SharedModule } from 'app/shared/shared.module';
import * as fromPost from './reducers/post.reducer';

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('posts', fromPost.reducer),
    EffectsModule.forFeature([PostEffects]),
  ],
  providers: [PostService],
  declarations: []
})
export class PostModule { }
