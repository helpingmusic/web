import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Post } from 'models/post';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  PostActionTypes,
  PostsLoaded,
  CreatePost,
  DeletePost,
  EditPost,
  FetchPostsPage,
  UpsertPost, FetchPostsForUser, FetchPost
} from '../actions/post.actions';

@Injectable()
export class PostEffects {

  endpoint = '/posts';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snack: MatSnackBar,
  ) {
  }

  @Effect()
  fetchPost$ = this.actions$.pipe(
    ofType(PostActionTypes.FetchPost),
    mergeMap((action: FetchPost) =>
      this.http.get<Post>(`${this.endpoint}/${action.payload.postId}`).pipe(
        map(post => new PostsLoaded({ posts: [post] })),
      )
    )
  );

  @Effect()
  fetchPage$ = this.actions$.pipe(
    ofType(PostActionTypes.FetchPostsPage),
    mergeMap((action: FetchPostsPage) =>
      this.http.get<Post[]>(this.endpoint, { params: { page: String(action.payload.page) } }).pipe(
        map(posts => new PostsLoaded({ posts })),
      )
    )
  );

  @Effect()
  fetchPostsForUser$ = this.actions$.pipe(
    ofType(PostActionTypes.FetchPostsForUser),
    mergeMap((action: FetchPostsForUser) =>
      this.http.get<Post[]>(this.endpoint, { params: { poster: action.payload.userId } }).pipe(
        map(posts => new PostsLoaded({ posts })),
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType(PostActionTypes.CreatePost),
    mergeMap((action: CreatePost) =>
      this.http.post<Post>(this.endpoint, action.payload).pipe(
        map(post => new UpsertPost(post)),
        tap(
          () => {},
          err => {
            this.snack.open('Error: Post Could Not Be Created', null, {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              panelClass: 'snack-error',
              politeness: 'assertive',
              duration: 5000,
            });
          }),
      )
    ),
  );


  @Effect()
  update$ = this.actions$.pipe(
    ofType(PostActionTypes.EditPost),
    mergeMap((action: EditPost) =>
      this.http.put<Post>(`${this.endpoint}/${action.payload.id}`, action.payload.changes).pipe(
        map(post => new UpsertPost(post))
      )
    ),
  );

  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(PostActionTypes.DeletePost),
    mergeMap((action: DeletePost) =>
      this.http.delete<Post>(`${this.endpoint}/${action.payload.id}`)
    ),
  );


}
