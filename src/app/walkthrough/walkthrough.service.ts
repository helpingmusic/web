import { User } from 'models/user';
import { distinctUntilChanged, first, map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AuthService } from 'app/core/auth/auth.service';

@Injectable()
export class WalkthroughService {

  private stepSource = new Subject<number>();
  public step$ = this.stepSource.asObservable().pipe(
    distinctUntilChanged());

  private _step = 1;
  private get step(): number {
    return this._step;
  }

  private set step(s: number) {
    this._step = s;
    this.stepSource.next(s);
  }

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.router.events.subscribe((e: NavigationEnd) => {
      if (e instanceof NavigationEnd && e.urlAfterRedirects) {
        const s = +e.urlAfterRedirects.split('/').pop();
        if (s) this.step = s;
      }
    });

    this.step$.subscribe(s => {
      this.router.navigate(['/walkthrough', s]);
    });
  }

  // Check if user has filled fields
  // and get the latest step they need to go to
  getAvailableStep(): Observable<number> {
    return this.auth.getCurrentUser().pipe(
      first(),
      map((u: User) => {
        if (!u.email || !u.first_name || !u.last_name) return 1;
        if (!u.stripe || !u.stripe.subscriptionId) return 2;
        if (!u.membership_types || u.membership_types.length === 0) return 3;
        if (!u.profession || !u.bio || !u.state || !u.city) return 3;
        if (!u.genres.length && !u.instruments.length && !u.skills) return 4;
        return 5;
      }),);
  }

  next() {
    this.step++;
  }

  back() {
    this.step--;
  }

}
