import { Injectable } from '@angular/core';

import { CollectionService } from 'app/shared/collection.service';
import { HttpClient } from '@angular/common/http';
import { Media } from 'models/media';

@Injectable()
export class MediaService extends CollectionService<Media> {

  constructor(http: HttpClient) {
    super(http);
    this.endpoint = '/media';
  }

}
