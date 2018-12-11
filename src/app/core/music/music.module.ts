import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerService } from 'app/core/music/player.service';
import { PlayerComponent } from 'app/core/music/player/player.component';
import { TrackService } from 'app/core/music/track.service';
import { SharedModule } from 'app/shared/shared.module';
import { StoreModule } from '@ngrx/store';
import * as fromTracks from './reducers/tracks.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TracksEffects } from './effects/tracks.effects';

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('tracks', fromTracks.reducer),
    EffectsModule.forFeature([TracksEffects]),
    RouterModule,
  ],
  providers: [TrackService, PlayerService],
  entryComponents: [PlayerComponent],
  declarations: [PlayerComponent],
  exports: [PlayerComponent],
})
export class MusicModule { }
