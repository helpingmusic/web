import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';

import { MemberContentComponent } from './member-content.component';
import { MediaComponent } from './media/media.component';
import { MediaService } from './media.service';
import { MediaEmbedComponent } from './media-embed.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild([{ path: '', component: MemberContentComponent }])
  ],
  declarations: [MemberContentComponent, MediaComponent, MediaEmbedComponent],
  providers: [MediaService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class MemberContentModule {
}
