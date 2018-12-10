import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { PostService } from 'app/core/post/post.service';
import { Post } from 'models/post';

@Component({
  selector: 'home-edit-post-modal',
  templateUrl: './edit-post-modal.component.html',
  styleUrls: ['./edit-post-modal.component.scss']
})
export class EditPostModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditPostModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { post: Post },
    private postService: PostService,
  ) {
    this.form = fb.group({
      content: [data.post.content, [val.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    this.postService.update(this.data.post._id, form.value);

    this.ref.close(true);
  }

}
