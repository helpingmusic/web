import { Doc } from './doc';
import {User} from 'models/user';

export class Comment extends Doc {
  commenter: User;
  parent?: string; // comment id
  thread: string; // thread id
  body: string;
  children: Array<Comment>;

  createdAt: Date;
  updatedAt: Date;
  removedAt: Date; // whether comment was deleted by user

  get isDeleted() {
    return !!this.removedAt;
  }

  constructor(props) {
    super(props);
  }

}
