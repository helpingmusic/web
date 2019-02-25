import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalService } from 'app/core/modal.service';

import { ReportService } from 'app/core/report.service';
import { EditReviewModalComponent } from 'app/main/member/reviews/edit-review-modal/edit-review-modal.component';
import { ReviewService } from 'app/main/member/reviews/review.service';
import { Review } from 'models/review';

import * as moment from 'moment';

@Component({
  selector: 'home-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.scss']
})
export class ReviewComponent implements OnInit {
  @Input() hasPermissions: boolean;
  @Input() review = new Review();

  createdAt: string;

  constructor(
    private reportService: ReportService,
    private modal: ModalService,
    private reviewService: ReviewService,
    private dialog: MatDialog,
  ) {
  }

  ngOnInit() {
    this.createdAt = moment(this.review.created_at).fromNow();
  }

  edit() {
    this.dialog.open(EditReviewModalComponent, {
      width: '400px',
      data: { review: this.review },
    });
  }

  delete() {
    this.modal.popup({
      title: 'Delete Review',
      text: `Are you sure you want to delete this review? It will be gone forever.`,
      confirmButtonText: 'Delete',
    })
      .then(() => {
        this.reviewService.delete(this.review._id)
          .subscribe(() => {
            this.modal.popup({
              type: 'success',
              title: 'Success',
              text: `The revew was deleted successfully.`,
              showCancelButton: false,
            });
          });
      })
      .catch(() => { /*swal noop*/
      });
  }

  report() {
    this.reportService.report('Review', this.review);
  }

}
