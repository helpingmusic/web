import { Action } from '@ngrx/store';
import { Announcement } from 'models/announcement';

export enum AnnouncementActionTypes {
  FetchAnnouncementsPage = '[Announcement] Fetch Announcements page',
  AnnouncementsLoaded = '[Announcement] Announcements Loaded',
}

export class FetchAnnouncementsPage implements Action {
  readonly type = AnnouncementActionTypes.FetchAnnouncementsPage;
  constructor(public payload: { page: number }) { }
}

export class AnnouncementsLoaded implements Action {
  readonly type = AnnouncementActionTypes.AnnouncementsLoaded;
  constructor(public payload: { announcements: any[] }) { }
}

export type AnnouncementActions = AnnouncementsLoaded
  | FetchAnnouncementsPage
