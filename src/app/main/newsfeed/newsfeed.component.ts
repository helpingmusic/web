import { AfterViewInit, Component, OnInit } from '@angular/core';

import { AuthService } from 'app/core/auth/auth.service';
import { PostService } from 'app/core/post/post.service';
import { Post } from 'models/post';
import { User } from 'models/user';

import { Observable } from 'rxjs';

@Component({
  selector: 'home-newsfeed',
  templateUrl: './newsfeed.component.html',
  styleUrls: ['./newsfeed.component.scss']
})
export class NewsfeedComponent implements OnInit, AfterViewInit {

  newPostContent: string;
  post$: Observable<Array<Post>>;
  isLoading: boolean;

  constructor(
    private auth: AuthService,
    public postService: PostService,
  ) {
  }

  ngOnInit() {
    this.post$ = this.postService.index();
  }

  ngAfterViewInit() {

  }

  onScroll() {
    this.postService.nextPage();
  }

  newPost() {
    if (!this.newPostContent) return;

    this.auth.getCurrentUser()
      .subscribe(
        (u: User) => {
          const p = Object.assign(new Post(), {
            content: this.newPostContent,
            poster: u._id,
          });
          this.postService.create(p);
          this.newPostContent = '';
        }
      );
  }

}
