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

  constructor(props) {
    super(props);
  }

}
