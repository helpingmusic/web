import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Announcement } from 'models/announcement';
import { map, mergeMap, tap } from 'rxjs/operators';
import {
  AnnouncementActionTypes,
  AnnouncementsLoaded,
  CreateAnnouncement,
  DeleteAnnouncement,
  EditAnnouncement,
  FetchAnnouncementsPage,
  UpsertAnnouncement
} from '../actions/announcement.actions';

@Injectable()
export class AnnouncementEffects {

  endpoint = '/announcements';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snack: MatSnackBar,
  ) {
  }

  @Effect()
  fetchPage$ = this.actions$.pipe(
    ofType(AnnouncementActionTypes.FetchAnnouncementsPage),
    mergeMap((action: FetchAnnouncementsPage) =>
      this.http.get<Announcement[]>(this.endpoint, { params: { page: String(action.payload.page) } }).pipe(
        map(announcements => new AnnouncementsLoaded({ announcements })),
      )
    )
  );

  @Effect()
  create$ = this.actions$.pipe(
    ofType(AnnouncementActionTypes.CreateAnnouncement),
    mergeMap((action: CreateAnnouncement) =>
      this.http.post<Announcement>(this.endpoint, action.payload).pipe(
        map(announcement => new UpsertAnnouncement(announcement)),
        tap(
          () => {},
          err => {
            this.snack.open('Error: Announcement Could Not Be Created', null, {
              verticalPosition: 'top',
              horizontalPosition: 'end',
              panelClass: 'snack-error',
              politeness: 'assertive',
              duration: 5000,
            });
          }),
      )
    ),
  );


  @Effect()
  update$ = this.actions$.pipe(
    ofType(AnnouncementActionTypes.EditAnnouncement),
    mergeMap((action: EditAnnouncement) =>
      this.http.put<Announcement>(`${this.endpoint}/${action.payload.id}`, action.payload.changes).pipe(
        map(announcement => new UpsertAnnouncement(announcement))
      )
    ),
  );

  @Effect({ dispatch: false })
  delete$ = this.actions$.pipe(
    ofType(AnnouncementActionTypes.DeleteAnnouncement),
    mergeMap((action: DeleteAnnouncement) =>
      this.http.delete<Announcement>(`${this.endpoint}/${action.payload.id}`)
    ),
  );


}
