import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { ModalService } from 'app/core/modal.service';
import { User } from 'models/user';
import { Post } from 'models/post';
import { PostService } from 'app/core/post/post.service';

@Component({
  selector: 'home-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {
  post$: Observable<Array<Post>>;
  member: User = new User();

  constructor(
    private postService: PostService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.route.parent.parent.data
      .subscribe((data: { member: User }) => {
        this.member = data.member;
        this.post$ = this.postService.findForUser(this.member._id);
      });
  }

}
