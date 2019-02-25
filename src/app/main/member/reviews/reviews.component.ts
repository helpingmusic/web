import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { NotificationService } from 'app/core/notification.service';
import { Review } from 'models/review';

import { User } from 'models/user';

import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { ReviewService } from './review.service';

@Component({
  selector: 'home-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit, AfterViewInit {

  userCanReview: boolean;
  currentUser = new User();
  member = new User();

  errors: any = {};

  review$: Observable<Array<Review>>;

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private reviewService: ReviewService,
    private modal: ModalService,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.route.parent.parent.data
      .subscribe((data: { member: User }) => {
        this.member = data.member;

        this.auth.getCurrentUser()
          .subscribe((u: User) => {
            // Can't review own account
            this.userCanReview = (data.member._id !== u._id);
            this.currentUser = u;
          });

        this.loadReviews();
      });


    this.notificationService.notifications$.pipe(
      first())
      .subscribe(() => this.notificationService.markRead('review'));

  }

  loadReviews() {
    this.review$ = this.reviewService.findForUser(this.member._id);
  }

  ngAfterViewInit() {

  }

}
