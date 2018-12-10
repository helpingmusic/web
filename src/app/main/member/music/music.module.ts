import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DeleteTrackModalComponent } from 'app/main/member/music/delete-track-modal.component';
import { EditTrackModalComponent } from 'app/main/member/music/edit-track-modal/edit-track-modal.component';

import { SharedModule } from 'app/shared/shared.module';
import { MusicComponent } from './music.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: MusicComponent }]),
    ReactiveFormsModule,
  ],
  declarations: [MusicComponent, EditTrackModalComponent, DeleteTrackModalComponent],
  entryComponents: [EditTrackModalComponent, DeleteTrackModalComponent],
  providers: []
})
export class MusicModule {
}
