
export type _id = any;

// generic mongoose doc
export class Doc {
  _id: _id;
  updated_at: string;
  created_at: string;

  constructor(body = {}) {
    Object.assign(this, body);
  }
};
