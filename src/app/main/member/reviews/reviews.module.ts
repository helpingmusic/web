import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateReviewFormComponent } from 'app/main/member/reviews/create-review-form.component';
import { EditReviewModalComponent } from 'app/main/member/reviews/edit-review-modal/edit-review-modal.component';

import { SharedModule } from 'app/shared/shared.module';

import { ReviewsComponent } from './reviews.component';
import { ReviewComponent } from './review/review.component';
import { ReviewService } from './review.service';
import { RatingComponent } from './rating.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: ReviewsComponent }]),
    ReactiveFormsModule,
  ],
  declarations: [ReviewsComponent, ReviewComponent, RatingComponent, EditReviewModalComponent, CreateReviewFormComponent],
  providers: [ReviewService],
  entryComponents: [EditReviewModalComponent]
})
export class ReviewsModule {
}
