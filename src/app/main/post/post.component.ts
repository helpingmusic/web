import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { PostService } from 'app/core/post/post.service';
import { Post } from 'models/post';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'home-post-thread',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post$: Observable<Post>;

  constructor(
    public postService: PostService,
    private activeRoute: ActivatedRoute,
  ) {
  }

  ngOnInit() {

    const postId = this.activeRoute.snapshot.paramMap.get('id');

    this.post$ = this.postService.findById(postId).pipe(
      tap(() => {
        setTimeout(() => {
          const el = document.getElementById(this.activeRoute.snapshot.queryParamMap.get('com'));
          if (el) el.className += ' focused-comment';
        }, 100);
      }));
  }


}
