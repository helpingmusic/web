import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeleteAnnouncementModalComponent } from 'app/main/announcements/delete-announcement-modal.component';

import { SharedModule } from 'app/shared/shared.module';

import { AnnouncementsComponent } from './announcements.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementService } from './announcement.service';
import { EditAnnouncementModalComponent } from './edit-announcement-modal/edit-announcement-modal.component';
import { StoreModule } from '@ngrx/store';
import * as fromAnnouncement from './reducers/announcement.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AnnouncementEffects } from './effects/announcement.effects';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: AnnouncementsComponent }]),
    ReactiveFormsModule,
    StoreModule.forFeature('announcements', fromAnnouncement.reducer),
    EffectsModule.forFeature([AnnouncementEffects]),
  ],
  declarations: [
    AnnouncementComponent,
    AnnouncementsComponent,
    EditAnnouncementModalComponent,
    DeleteAnnouncementModalComponent,
  ],
  entryComponents: [EditAnnouncementModalComponent, DeleteAnnouncementModalComponent],
  providers: [AnnouncementService],
  schemas: [NO_ERRORS_SCHEMA]
})
export class AnnouncementsModule {
}
