import { Doc } from './doc';
import {Comment} from 'models/comment';

export class Thread extends Doc {
  media: {
    kind: string,
    item: string, // id
  };
  locked: boolean;
  comments: Array<Comment>;
}
