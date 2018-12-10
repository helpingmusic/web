import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { AuthService } from 'app/core/auth/auth.service';
import { User } from 'models/user';
import { Media } from 'models/media';


@Component({
  selector: 'home-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  @Input() instance: Media;
  @Output() deleteMedia = new EventEmitter<Media>();
  @Output() editMedia = new EventEmitter<Media>();

  userRole: string;

  constructor(private auth: AuthService) {
  }

  ngOnInit() {
    this.auth.getCurrentUser()
      .subscribe((u: User) => {
        this.userRole = u.role;
      });
  }

  edit() {
    this.editMedia.emit(this.instance);
  }

  delete() {
    this.deleteMedia.emit(this.instance);
  }

}
