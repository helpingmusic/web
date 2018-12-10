import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Post } from 'models/post';

export enum PostActionTypes {
  FetchPostsPage = '[Post] Fetch Posts page',
  FetchPostsForUser = '[Post] Fetch Posts for User',
  FetchPost = '[Post] Fetch Post',
  EditPost = '[Post] Edit Post',
  CreatePost = '[Post] Create Post',
  DeletePost = '[Post] Delete Post',
  UpsertPost = '[Post] Upsert Post',
  PostsLoaded = '[Post] Posts Loaded',
}

export class FetchPostsPage implements Action {
  readonly type = PostActionTypes.FetchPostsPage;
  constructor(public payload: { page: number }) { }
}

export class FetchPostsForUser implements Action {
  readonly type = PostActionTypes.FetchPostsForUser;
  constructor(public payload: { userId: string }) { }
}

export class FetchPost implements Action {
  readonly type = PostActionTypes.FetchPost;
  constructor(public payload: { postId: string }) { }
}

export class CreatePost implements Action {
  readonly type = PostActionTypes.CreatePost;
  constructor(public payload: Partial<Post>) { }
}

export class EditPost implements Action {
  readonly type = PostActionTypes.EditPost;
  constructor(public payload: Update<Post>) { }
}

export class DeletePost implements Action {
  readonly type = PostActionTypes.DeletePost;
  constructor(public payload: { id: string }) {}
}

export class PostsLoaded implements Action {
  readonly type = PostActionTypes.PostsLoaded;
  constructor(public payload: { posts: Post[] }) { }
}

export class UpsertPost implements Action {
  readonly type = PostActionTypes.UpsertPost;
  constructor(public payload: Post) { }
}


export type PostActions = PostsLoaded
  | FetchPostsPage
  | FetchPostsForUser
  | FetchPost
  | UpsertPost
  | EditPost
  | CreatePost
  | DeletePost;
