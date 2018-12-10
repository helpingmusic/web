import { User } from 'models/user';
import { Thread } from 'models/thread';

export class Post {
  _id: string;
  content: string;
  poster: User;
  created_at: string;
  updated_at: string;
  thread: Thread;
}
