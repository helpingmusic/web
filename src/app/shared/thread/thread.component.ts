import { Component, Input, OnInit } from '@angular/core';
import { Thread } from 'models/thread';
import { ThreadService } from 'app/core/thread.service';
import { Comment } from 'models/comment';

@Component({
  selector: 'home-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit {

  @Input('thread') thread: Thread;
  @Input('length') length = 4; // show n comments

  commentBody: string;

  get commentable() {
    return !this.thread.locked;
  }

  get threadPreview() {
    let i = this.thread.comments.length - this.length;
    if (i < 0) i = 0;
    return i;
  }

  constructor(
    private threadService: ThreadService,
  ) {
  }

  ngOnInit() {
  }

  comment(body) {
    const comment = new Comment({
      body,
      thread: this.thread._id,
    });

    this.threadService.postComment(comment)
      .subscribe(c => {
        this.commentBody = '';
        this.thread.comments.push(c);
      });
  }

}
