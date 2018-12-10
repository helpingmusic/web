import { filter, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Application } from 'models/application';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class ApplicationService {

  private readonly endpoint = `/applications`;

  private _applications = new BehaviorSubject<Array<Application>>([]);
  public readonly applications$ = this._applications.asObservable().pipe(
    filter(apps => !!apps.length));

  constructor(
    protected http: HttpClient,
  ) {
  }

  getOwn(): Observable<Array<Application>> {
    if (!this._applications.getValue().length) {
      this.http.get<Array<Application>>(`/users/me/applications`)
        .subscribe(apps => this._applications.next(apps));
    }

    return this.applications$;
  }

  /**
   * Get the type of application for current user
   * @param {string} type of application
   */
  getType(type: string) {
    return this.getOwn().pipe(
      map(apps => apps.filter(a => a.type === type)[0]));
  }

  getAll(): Observable<Array<Application>> {
    return this.http.get<Array<Application>>(this.endpoint);
  }

  getById(id: string): Observable<Application> {
    return this.http.get<Application>(`${this.endpoint}/${id}`);
  }

  save(app: Application): Observable<Application> {
    let action;

    if (app._id) { // already exists, just updating
      action = this.http.put<Application>(`${this.endpoint}/${app._id}`, app);
    } else {
      action = this.http.post<Application>(this.endpoint, app);
    }
    return action
      .do(updatedApp => {
        const applications = this._applications.getValue();
        const i = applications.findIndex(a => a._id === updatedApp._id);
        if (i === -1) {
          applications.unshift(updatedApp);
        } else {
          Object.assign(applications[i], updatedApp);
        }
        this._applications.next(applications);
      });

  }

}
