import { Injectable } from '@angular/core';

import store from 'store';

@Injectable()
export class StoreService {
  private store;
  private prefix = 'HOME>';

  constructor() {
    this.store = store;
  }

  get(key: string) {
    return this.store.get(this.prefix + key);
  }

  set(key: string, val: any) {
    this.store.set(this.prefix + key, val);
  }

  remove(key: string) {
    this.store.remove(this.prefix + key);
  }

  clearAll() {
    this.store.each((key: string, val: string) => {
      if (key.indexOf(this.prefix) === 0) {
        this.remove(key);
      }
    });
  }

}
