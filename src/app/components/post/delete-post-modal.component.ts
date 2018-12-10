import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PostService } from 'app/core/post/post.service';
import { Post } from 'models/post';

@Component({
  selector: 'home-delete-post-modal',
  template: `
    <h2 mat-dialog-title>Delete Post</h2>
    <mat-dialog-content>
      <p>
        Are you sure you want to remove this post?
      </p>
      <p>
        This action cannot be undone.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>No</button>
      
      <button (click)="remove()" class="btn-danger" mat-button type="submit">Remove</button>
    </mat-dialog-actions>

  `,
  styles: []
})
export class DeletePostModalComponent implements OnInit {

  constructor(
    private ref: MatDialogRef<DeletePostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private postService: PostService,
  ) {
  }

  ngOnInit() {
  }

  remove() {
    this.postService.delete(this.data.post._id);
    this.ref.close(true);
  }

}
