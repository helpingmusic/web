import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import { Announcement } from 'models/announcement';

export enum AnnouncementActionTypes {
  FetchAnnouncementsPage = '[Announcement] Fetch Announcements page',
  EditAnnouncement = '[Announcement] Edit Announcement',
  CreateAnnouncement = '[Announcement] Create Announcement',
  DeleteAnnouncement = '[Announcement] Delete Announcement',
  UpsertAnnouncement = '[Announcement] Upsert Announcement',
  AnnouncementsLoaded = '[Announcement] Announcements Loaded',
}

export class FetchAnnouncementsPage implements Action {
  readonly type = AnnouncementActionTypes.FetchAnnouncementsPage;
  constructor(public payload: { page: number }) { }
}

export class CreateAnnouncement implements Action {
  readonly type = AnnouncementActionTypes.CreateAnnouncement;
  constructor(public payload: Partial<Announcement>) { }
}

export class EditAnnouncement implements Action {
  readonly type = AnnouncementActionTypes.EditAnnouncement;
  constructor(public payload: Update<Announcement>) { }
}

export class DeleteAnnouncement implements Action {
  readonly type = AnnouncementActionTypes.DeleteAnnouncement;
  constructor(public payload: { id: string }) {}
}

export class AnnouncementsLoaded implements Action {
  readonly type = AnnouncementActionTypes.AnnouncementsLoaded;
  constructor(public payload: { announcements: Announcement[] }) { }
}

export class UpsertAnnouncement implements Action {
  readonly type = AnnouncementActionTypes.UpsertAnnouncement;
  constructor(public payload: Announcement) { }
}


export type AnnouncementActions = AnnouncementsLoaded
  | FetchAnnouncementsPage
  | UpsertAnnouncement
  | EditAnnouncement
  | CreateAnnouncement
  | DeleteAnnouncement;
