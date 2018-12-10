import { Doc } from './doc';
import { User } from './user';

export class Application extends Doc {
  type: string;
  status: string;
  applicant: User;
  data: any = {};
  media: Array<{ kind: string; item: any; }>;
  reviewedOn: Date;
  notes: string;
  createdAt: string;
  updatedAt: string;

  constructor(values?: object) {
    super();
    Object.assign(this, values);
    this.created_at = this.createdAt;
    this.updated_at = this.updatedAt;
  }
}
