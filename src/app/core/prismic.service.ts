import { Injectable } from '@angular/core';
import { api, Api } from 'prismic-javascript';
import ResolvedApi from 'prismic-javascript/d.ts/ResolvedApi';

@Injectable({
  providedIn: 'root'
})
export class PrismicService {

  api: ResolvedApi;

  constructor() {
    this.getApi();
  }

  async getApi() {
    if (!this.api) {
      const api = new Api("https://helpingmusic.prismic.io/api/v2");
      this.api = await api.get();
    }
    return this.api
  }

  async query(q: string | string[], opts: any) {
    const api = await this.getApi();
    return api.query(q, opts);
  }

}
