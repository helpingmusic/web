import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Comment } from 'models/comment';

@Injectable()
export class ThreadService {

  constructor(
    private http: HttpClient,
  ) {
  }

  postComment(comment: Comment) {
    return this.http.post<Comment>(`/threads/${comment.thread}/comments`, comment);
  }

  updateComment(threadId: string, commentId: string, updates: Partial<Comment>) {
    return this.http.put<Comment>(`/threads/${threadId}/comments/${commentId}`, updates);
  }

  deleteComment(comment: Comment) {
    return this.http.delete<Comment>(`/threads/${comment.thread}/comments/${comment._id}`);
  }

}
