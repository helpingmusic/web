import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ModalService } from 'app/core/modal.service';
import { Report } from 'models/report';

@Injectable()
export class ReportService {
  endpoint = '/reports';

  constructor(
    private http: HttpClient,
    private modal: ModalService
  ) {
  }

  create(r: any) {
    return this.http.post<Report>(this.endpoint, r);
  }

  /**
   *  Prompt the user to report a given media instance
   */
  report(kind: string, media: any) {

    const r = {
      media: {
        kind: kind,
        item: media._id,
      }
    };

    this.modal.popup({
      title: `Report ${r.media.kind}`,
      type: 'question',
      html: `
        <p>Please select why you wish to report this ${r.media.kind}.</p>
        <div class="form-group">
          <select id="reportReason" class="form-control">
            <option>Offensive Content</option>
            <option>Not Relative to H.O.M.E.</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-group">
          <textarea id="reportDescription"
            placeholder="Anything else you wish to add?"
            rows="3"
            class="form-control"></textarea>
        </div>
      `,
      confirmButtonText: 'Report',
      preConfirm: function () {
        return new Promise(function (resolve) {
          resolve({
            reason: $('#reportReason').val(),
            description: $('#reportDescription').val() || null,
          });
        });
      },
    })
      .then(res => {
        if (!res) return;

        this.create({
          mediaType: kind,
          mediaId: media._id,
          description: res.description,
          reason: res.reason,
        })
          .subscribe(rep => {
              this.modal.popup({
                title: 'Success',
                type: 'success',
                text: 'Your report has been noted and is under review. Thanks for making H.O.M.E. a better community!',
                showCancelButton: false,
              });
            },
            err => this.modal.error(),
          );
      });
  }

}
