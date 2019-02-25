import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material';
import { Thread } from 'models/thread';
import { ThreadService } from 'app/core/thread.service';
import { Comment } from 'models/comment';

@Component({
  selector: 'home-thread',
  templateUrl: './thread.component.html',
  styleUrls: ['./thread.component.scss']
})
export class ThreadComponent implements OnInit, OnChanges {

  @Input('thread') thread: Thread;
  @Input('length') length = 4; // show n comments

  treeControl = new NestedTreeControl<Comment>(node => node.children);
  dataSource = new MatTreeNestedDataSource<Comment>();

  commentBody: string;
  hasChild = (_: number, node: Comment) => !!node.children && node.children.length > 0;


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

  ngOnChanges(c) {
    if (c.thread) {
      this.dataSource.data = this.thread.comments;
    }
  }

  comment(body) {
    const comment = new Comment({
      body,
      thread: this.thread._id,
    });

    this.threadService.postComment(comment)
      .subscribe(c => {
        this.commentBody = '';
        this.thread.comments = [...this.thread.comments, c];
        this.dataSource.data = this.thread.comments;
      });
  }

}
