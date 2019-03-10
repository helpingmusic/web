import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators as val } from '@angular/forms';
import { ReviewService } from 'app/main/member/reviews/review.service';
import { Review } from 'models/review';

@Component({
  selector: 'home-create-review-form',
  template: `
    <div class="mb-md">
      <form [formGroup]="form" (ngSubmit)="onSubmit(form)">
        <mat-card>
          <mat-card-header>
            <h3 mat-card-title>Write a Review</h3>
            <p mat-card-subtitle>Give your community members constructive feedback.</p>
          </mat-card-header>
          <mat-card-content>
            <mat-form-field appearance="outline">
              <mat-label>Your Review</mat-label>
              <textarea formControlName="content"
                        matInput
                        matTextareaAutosize
                        placeholder="What do you know about this person?"
                        rows="4">
               </textarea>
              <mat-hint *ngIf="errors('content')?.required">This field is required.</mat-hint>
            </mat-form-field>

          </mat-card-content>
          <mat-card-actions class="row">
            <div>
              <home-rating formControlName="rating"></home-rating>
              <p class="hint error mt-sm mb-n ml-md" *ngIf="errors('rating')?.required">
                A Rating is required.
              </p>
            </div>

            <div>
              <button type="submit" mat-flat-button color="accent">Post</button>
            </div>
          </mat-card-actions>
          <mat-progress-bar *ngIf="isLoading" color="accent" mode="indeterminate"></mat-progress-bar>
        </mat-card>

      </form>
    </div>
  `,
  styles: [`
    mat-card-actions {
      display: flex !important;
      justify-content: space-between !important;
    }
  `]
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
