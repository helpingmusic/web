import { Doc } from './doc';

export class Discount extends Doc {
  title: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  created_at: string;
  updated_at: string;

  constructor() {
    super();
    this.created_at = this.createdAt;
    this.updated_at = this.updatedAt;
  }
}
