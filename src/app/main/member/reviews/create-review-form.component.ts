import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { ReviewService } from 'app/main/member/reviews/review.service';
import { Review } from 'models/review';

@Component({
  selector: 'home-create-review-form',
  template: `
    <div class="mb-md text-right">
      <form class="profile-tab" [formGroup]="form"
            (ngSubmit)="onSubmit(form)">

        <mat-form-field>
            <textarea formControlName="content"
                      matInput
                      placeholder="What do you know about this person?"
                      rows="4">
           </textarea>
          <mat-hint *ngIf="errors('content')?.required">This field is required.</mat-hint>
        </mat-form-field>

        <div class="clearfix">
          <div class="pull-left">
            <home-rating formControlName="rating"></home-rating>
          </div>
          <div class="pull-left">
            <p class="hint error mt-sm mb-n ml-md" *ngIf="errors('rating')?.required">
              A Rating is required.
            </p>
          </div>

          <div class="pull-right">
            <button type="submit" mat-flat-button color="accent">Post</button>
          </div>
        </div>

      </form>
      <mat-progress-bar *ngIf="isLoading" color="accent" mode="indeterminate"></mat-progress-bar>
    </div>
  `,
  styles: []
})
export class CreateReviewFormComponent implements OnInit {

  isLoading: boolean;
  form: FormGroup;

  @Input() reviewee: string;
  @Output() created = new EventEmitter<Review>();

  constructor(
    private fb: FormBuilder,
    private reviewService: ReviewService,
  ) {
    this.form = fb.group({
      content: ['', [val.required]],
      rating: ['', [val.required, val.min(0), val.max(5)]],
    });
  }

  ngOnInit() {
  }

  errors(field: string) {
    if (!this.form.get(field).dirty) return {};
    return this.form.get(field).errors;
  }

  onSubmit(form: FormGroup) {
    if (form.invalid) return false;
    this.isLoading = true;

    this.reviewService.create({ ...form.value, reviewee: this.reviewee })
      .subscribe(review => {
        this.isLoading = false;
        this.form.reset();
        this.form.markAsPristine();
        this.created.emit(review);
      });
  }

}
