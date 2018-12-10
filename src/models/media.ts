import { Doc } from './doc';

export class Media extends Doc {
  title: string;
  body: string;
  type: string;
  mediumId: string;
  url: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;

  constructor (body?: Object) {
    super(body);
  }

}
