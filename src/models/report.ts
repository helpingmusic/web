import { Doc } from './doc';

export class Report extends Doc {
  status: string;

  reporter: string; // _id
  media: {
    kind: string;
    item: any;
  };

  isOpen: boolean;
  reason: string;
  description: string;

  statusReason: string;

  resolved_at: string;
  opened_at: string;

  created_at: string;
  updated_at: string;

  constructor() {
    super();
    this.created_at = this.opened_at;
    this.updated_at = this.resolved_at;
  }
}
