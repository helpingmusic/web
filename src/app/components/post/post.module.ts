import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeMaterialModule } from 'app/shared/home-material/home-material.module';
import { DeletePostModalComponent } from 'app/components/post/delete-post-modal.component';
import { EditPostModalComponent } from 'app/components/post/edit-post-modal/edit-post-modal.component';
import { PostComponent } from 'app/components/post/post.component';
import { SharedModule } from 'app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  declarations: [PostComponent, EditPostModalComponent, DeletePostModalComponent],
  entryComponents: [EditPostModalComponent, DeletePostModalComponent],
  exports: [PostComponent],
})
export class PostModule { }
