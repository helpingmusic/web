import { User } from 'models/user';
import { first, tap } from 'rxjs/operators';
import { Component, Input, OnInit } from '@angular/core';
import { ThreadService } from 'app/core/thread.service';
import { Comment } from 'models/comment';
import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { ReportService } from 'app/core/report.service';
import * as moment from 'moment';

@Component({
  selector: 'home-thread-comment',
  templateUrl: './thread-comment.component.html',
  styleUrls: ['./thread-comment.component.scss']
})
export class ThreadCommentComponent implements OnInit {
  CHAR_LIMIT = 140;
  LINE_LIMIT = 4;

  _comment: Comment;
  @Input('comment')
  get comment() {
    return this._comment;
  }

  set comment(c) {
    this._comment = new Comment(c);
  }

  showResponse = false;
  response: string;

  isOwnComment: boolean;
  isEditing: boolean;

  showAll: boolean;

  // way to limit comment length
  get text() {
    if (this.showAll) return this.comment.body;

    const splitByNewLines = this.comment.body.split(/\r\n|\r|\n/);
    let text = this.comment.body;

    // check to make sure they don't have a bunch of new lines
    if (splitByNewLines.length > this.LINE_LIMIT) {
      text = splitByNewLines.splice(0, this.LINE_LIMIT).join('\n');

      // check that they are within char limit
    } else if (this.comment.body.length > this.CHAR_LIMIT) {
      const lastSpace = this.comment.body.indexOf(' ', this.CHAR_LIMIT);
      if (lastSpace === -1) return this.comment.body;
      text = this.comment.body.substring(0, lastSpace - 1);

    } else {
      return this.comment.body;
    }

    return text + '...';
  }

  get bodyHasMore() {
    return this.comment.body !== this.text;
  }

  user: User;

  constructor(
    private threadService: ThreadService,
    private auth: AuthService,
    private modal: ModalService,
    private reportService: ReportService,
  ) {
  }

  ngOnInit() {
    this.auth.getCurrentUser().pipe(first())
      .subscribe((u: User) => {
        this.user = u;
        this.isOwnComment = u._id === this.comment.commenter._id;
      });
  }

  get isEdited() {
    return !moment(this.comment.createdAt).isSame(this.comment.updatedAt);
  }

  respond(body) {
    const comment = new Comment({
      body,
      thread: this.comment.thread,
      parent: this.comment._id,
    });

    this.threadService.postComment(comment)
      .subscribe(c => {
        this.showResponse = false;
        this.response = '';
        c.commenter = this.user;
        this.comment = { ...this.comment, children: [...this.comment.children, c]};
      });

  }

  editComment(body) {
    const c = this.comment;
    this.threadService.updateComment(c.thread, c._id, { body })
      .pipe(tap(() => this.isEditing = false))
      .subscribe(c => this.comment = {
        ...this.comment,
        ...c,
        commenter: this.comment.commenter,
      });
  }

  report() {
    this.reportService.report('Comment', this.comment);
  }

  async deleteComment() {

    const doDelete = await this.modal.popup({
      title: 'Delete Comment',
      text: `Are you sure you want to delete your comment?`,
      confirmButtonText: 'Delete',
      confirmButtonClass: 'btn btn-danger pull-right',
    });

    if (!doDelete) return;

    this.threadService.deleteComment(this.comment)
      .subscribe(c => this.comment = { ...this.comment, ...c });
  }

}
