import { Doc } from './doc';
import { User } from 'models/user';

export class Song extends Doc {
  title: string;
  user: User;

  file: File;
  href: string;
  tags: Array<string> = [];
  duration: number;
  s3: any;

  filename: string;
  byteLength: number;
  mediaType: string;
}
