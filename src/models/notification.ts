import { Doc } from './doc';

export class Notification extends Doc {
  title: string;
  description: string;
  link: string;
  type: string;
  data: any;

  read: boolean; // whether user has read notification
  readAt: Date;
  linkCommands: Array<any>;
  display: {
    icon: string;
    color: string;
  };
  fromNow: string;
  createdAt: string;
}
