import { createEntityAdapter, Dictionary, EntityAdapter, EntityState } from '@ngrx/entity';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Post } from 'models/post';
import * as moment from 'moment';
import { PostActions, PostActionTypes } from '../actions/post.actions';

export interface State extends EntityState<Post> {
  page: number;
}

export const adapter: EntityAdapter<Post> = createEntityAdapter<Post>({
  selectId: (a: Post) => a._id,
  sortComparer(a: Post, b: Post): number {
    return moment(b.created_at).unix() - moment(a.created_at).unix();
  },
});

export const initialState: State = adapter.getInitialState({
  page: 0,
});


const { selectAll, selectEntities } = adapter.getSelectors();
export const selectPostsState = createFeatureSelector<State>('posts');
export const selectPosts = createSelector(selectPostsState, selectAll);
export const selectPostEntities = createSelector(selectPostsState, selectEntities);
export const getPostsPage = createSelector(
  selectPostsState,
  (s: State) => s.page,
);
export const selectPostsForUser = createSelector(
  selectPosts,
  (posts: Post[], userId: string) => posts.filter(p => p.poster._id === userId),
);

export const selectPostById = createSelector(
  selectPostEntities,
  (posts: Dictionary<Post>, postId: string) => posts[postId],
);


export function reducer(state = initialState, action: PostActions): State {
  switch (action.type) {

    case PostActionTypes.PostsLoaded:
      return adapter.upsertMany(action.payload.posts, state);

    case PostActionTypes.UpsertPost:
      return adapter.upsertOne(action.payload, state);

    case PostActionTypes.EditPost:
      return adapter.updateOne(action.payload, state);

    case PostActionTypes.FetchPostsPage:
      return { ...state, page: action.payload.page };

    case PostActionTypes.DeletePost:
      return adapter.removeOne(action.payload.id, state);

    default:
      return state;
  }
}
