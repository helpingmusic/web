import { Doc } from './doc';
import { User } from 'models/user';

export class Review extends Doc {
  content: string;
  rating: number;
  poster: User;
  reviewee: User;
}
