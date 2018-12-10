import { catchError, first, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CollectionService } from 'app/shared/collection.service';
import { Issue } from 'models/issue';
import { User } from 'models/user';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable } from 'rxjs';


@Injectable()
export class IssueService extends CollectionService<Issue> {

  constructor(private auth: AuthService, http: HttpClient) {
    super(http);
    this.endpoint = '/issues';
  }

  save(iss: Issue): Observable<Issue> {
    return this.auth.getCurrentUser().pipe(
      first(),
      catchError(() => null),
      switchMap((u: User) => {
        if (!iss._id) iss.submittedBy = u;
        return super.save(iss);
      }),);
  }

}
