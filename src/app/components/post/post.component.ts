import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DeletePostModalComponent } from 'app/components/post/delete-post-modal.component';
import { EditPostModalComponent } from 'app/components/post/edit-post-modal/edit-post-modal.component';
import { ThreadService } from 'app/core/thread.service';

import * as moment from 'moment';

import { AuthService } from 'app/core/auth/auth.service';
import { ReportService } from 'app/core/report.service';
import { User } from 'models/user';
import { Comment } from 'models/comment';
import { Post } from 'models/post';

@Component({
  selector: 'home-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  @Input() post: Post;
  @Input() threadLength = 4;

  showCommentBox: boolean;
  userId: string;
  postedAt: string;
  user: User;

  constructor(
    private auth: AuthService,
    private reportService: ReportService,
    private dialog: MatDialog,
    private threadService: ThreadService,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe((u: User) => {
        this.user = u;
        this.userId = u._id;
      });

    this.postedAt = moment(this.post.created_at).fromNow();
  }

  edit() {
    this.dialog.open(EditPostModalComponent, {
      width: '400px',
      data: { post: this.post },
    })
  }

  delete() {
    this.dialog.open(DeletePostModalComponent, {
      width: '400px',
      data: { post: this.post },
    })
  }

  comment(body: string) {
    const comment = new Comment({
      body,
      thread: this.post.thread._id,
    });

    this.showCommentBox = false;

    this.threadService.postComment(comment)
      .subscribe(c => {
        c.commenter = this.user;
        this.post.thread.comments.push(c);
      });
  }

  report() {
    this.reportService.report('Post', this.post);
  }

}
