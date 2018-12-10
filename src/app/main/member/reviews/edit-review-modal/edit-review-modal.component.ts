import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { ReviewService } from 'app/main/member/reviews/review.service';
import { Review } from 'models/review';

@Component({
  selector: 'home-edit-review-modal',
  templateUrl: './edit-review-modal.component.html',
  styleUrls: ['./edit-review-modal.component.scss']
})
export class EditReviewModalComponent implements OnInit {

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<EditReviewModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { review: Review },
    private reviewService: ReviewService,
  ) {
    this.form = fb.group({
      content: [data.review.content, [val.required]],
      rating: [data.review.rating, [val.required]],
    });
  }

  ngOnInit() {
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;

    this.reviewService.update(this.data.review._id, form.value)
      .subscribe(res => this.ref.close(res));
  }

}
