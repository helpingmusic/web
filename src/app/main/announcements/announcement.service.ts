import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FetchAnnouncementsPage } from 'app/main/announcements/actions/announcement.actions';
import { Announcement } from 'models/announcement';
import { take } from 'rxjs/operators';
import * as fromAnnouncements from './reducers/announcement.reducer';
import { getAnnouncementsPage, selectAnnouncements } from './reducers/announcement.reducer';

@Injectable()
export class AnnouncementService {

  endpoint = '/announcements';

  constructor(
    private http: HttpClient,
    private store: Store<fromAnnouncements.State>
  ) {
  }

  nextPage() {
    this.store.pipe(
      select(getAnnouncementsPage),
      take(1),
    )
      .subscribe(page =>
        this.store.dispatch(new FetchAnnouncementsPage({ page: page + 1 }))
      );
  }

  index() {
    this.nextPage();

    return this.store.pipe(select(selectAnnouncements));
  }

}
