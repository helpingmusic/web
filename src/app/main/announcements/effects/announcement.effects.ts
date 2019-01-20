import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { PrismicService } from 'app/core/prismic.service';
import { Predicates } from 'prismic-javascript';
import ApiSearchResponse from 'prismic-javascript/d.ts/ApiSearchResponse';
import { from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { AnnouncementActionTypes, AnnouncementsLoaded, FetchAnnouncementsPage, } from '../actions/announcement.actions';

@Injectable()
export class AnnouncementEffects {

  endpoint = '/announcements';

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private snack: MatSnackBar,
    private cms: PrismicService,
  ) {
  }

  @Effect()
  fetchPage$ = this.actions$.pipe(
    ofType(AnnouncementActionTypes.FetchAnnouncementsPage),
    mergeMap((action: FetchAnnouncementsPage) => from(
      this.cms.query(
        Predicates.at('document.type', 'announcement'),
        {
          orderings: '[my.announcement.first_publication_date desc]',
          pageSize: 20,
          page: action.payload.page,
        }
      )
    )),
    map((results: any) => new AnnouncementsLoaded({ announcements: results.results }))
  );


}
