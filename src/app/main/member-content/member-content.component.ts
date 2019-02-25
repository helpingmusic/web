import { share } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';

import { Media } from 'models/media';
import { MediaService } from './media.service';

@Component({
  selector: 'home-member-content',
  templateUrl: './member-content.component.html',
  styleUrls: ['./member-content.component.scss']
})
export class MemberContentComponent implements OnInit {

  media$: Observable<Array<Media>>;

  constructor(
    private mediaService: MediaService,
  ) {
  }

  ngOnInit() {
    this.media$ = this.mediaService.query().pipe(share());
  }

}
