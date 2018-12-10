import { share } from 'rxjs/operators';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';

import { Observable } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';
import { ModalService } from 'app/core/modal.service';
import { BsModalComponent } from 'ng2-bs3-modal';

import { Media } from 'models/media';
import { MediaService } from './media.service';

@Component({
  selector: 'home-member-content',
  templateUrl: './member-content.component.html',
  styleUrls: ['./member-content.component.scss']
})
export class MemberContentComponent implements OnInit, AfterViewInit {

  @ViewChild('mediaEditorModal') mediaEditorModal: BsModalComponent;

  editingMedia = new Media();
  mediaEditorLoading: boolean;
  isAdmin: boolean;
  media$: Observable<Array<Media>>;

  constructor(
    private auth: AuthService,
    private mediaService: MediaService,
    private modal: ModalService,
  ) {
  }

  ngOnInit() {
    this.isAdmin = this.auth.hasRole('admin');

    this.media$ = this.mediaService.query().pipe(
      share());
  }

  ngAfterViewInit() {
    $.material.init('home-member-content *');
  }

  editMedia(d: Media) {
    this.editingMedia = d || new Media({ type: 'youtube' });
    this.mediaEditorModal.open();
  }

  onMediaSubmit(form) {
    if (form.valid) {
      this.mediaEditorLoading = true;
      const p = Object.assign({}, this.editingMedia, form.value);

      this.mediaService.save(p)
        .subscribe(
          () => {
            this.mediaEditorModal.close();
            this.mediaEditorLoading = false;
          },
          res => {
            this.mediaEditorLoading = false;
            // const { errors } = JSON.parse(res.error);
          },
        );
    }
  }

  onDeleteMedia(d: Media) {
    this.modal.popup({
      title: 'Delete Media',
      text: `Are you sure you want to delete the item "${d.title}"? It will be gone forever.`,
      confirmButtonText: 'Delete',
      closeOnConfirm: false,
    })
      .then(confirm => {
        if (!confirm) return;
        this.mediaService.delete(d)
          .subscribe(() => {
            this.modal.popup({
              type: 'success',
              title: 'Success',
              text: `The item "${d.title}" was delete successfully.`,
              showCancelButton: false,
            });
          });
      });
  }


}
