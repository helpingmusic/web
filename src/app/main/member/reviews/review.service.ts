import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Review } from 'models/review';
import { share } from 'rxjs/operators';

@Injectable()
export class ReviewService {

  endpoint = '/reviews';

  constructor(
    private http: HttpClient
  ) {
  }

  findForUser(user: string) {
    return this.http.get<Review[]>(this.endpoint, { params: { user } })
      .pipe(share());
  }

  create(body: Partial<Review>) {
    return this.http.post<Review>(this.endpoint, body);
  }

  update(id: string, body: Partial<Review>) {
    return this.http.put<Review>(`${this.endpoint}/${id}`, body);
  }

  delete(id: string) {
    return this.http.delete<Review>(`${this.endpoint}/${id}`);
  }

}
