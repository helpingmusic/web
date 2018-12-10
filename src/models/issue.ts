import { Doc } from './doc';
import { User } from './user';

export class Issue extends Doc {

  description: string;
  type: string;

  submittedBy?: User;

  closed_at: string;
  opened_at: string;

  constructor(values?: object) {
    super();
    Object.assign(this, values);
  }
}
