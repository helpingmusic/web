import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { CreatePost, DeletePost, EditPost, FetchPost, FetchPostsForUser, FetchPostsPage } from 'app/core/post/actions/post.actions';
import { Post } from 'models/post';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import * as fromPosts from './reducers/post.reducer';
import { getPostsPage, selectPostById, selectPosts, selectPostsForUser } from './reducers/post.reducer';



@Injectable()
export class PostService {

  constructor(
    private http: HttpClient,
    private store: Store<fromPosts.State>
  ) {}

  findById(postId: string) {
    this.store.dispatch(new FetchPost({ postId }));
    return this.store.pipe(select(selectPostById, postId));
  }

  /**
   * @param poster - user id
   */
  findForUser(poster: string): Observable<Array<Post>> {
    this.store.dispatch(new FetchPostsForUser({ userId: poster }));
    return this.store.pipe(select(selectPostsForUser, poster));
  }

  nextPage() {
    this.store.pipe(
      select(getPostsPage),
      take(1),
    )
      .subscribe(page =>
        this.store.dispatch(new FetchPostsPage({ page: page + 1 }))
      );
  }

  index() {
    this.nextPage();

    return this.store.pipe(select(selectPosts));
  }

  create(body: Partial<Post>) {
    this.store.dispatch(new CreatePost(body));
  }

  update(id: string, changes: Partial<Post>) {
    this.store.dispatch(new EditPost({ id, changes }));
  }

  delete(id: string) {
    this.store.dispatch(new DeletePost({ id }));
  }

}
