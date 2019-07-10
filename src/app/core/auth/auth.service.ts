import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'app/core/store.service';
import { UserService } from 'app/core/user/user.service';
import { User } from 'models/user';

import * as Raven from 'raven-js';

import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, first, map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import * as moment from 'moment';

const setStunningBarCustomer = (cust: string) => {
  const e = document.createElement('script'),
    s = document.getElementsByTagName('script')[0];
  e.src = 'https://d1gqkepxkcxgvm.cloudfront.net/stunning-bar.js';
  e.id = 'stunning-bar';
  e.setAttribute('data-app-ckey', '2901otexqpalzjmdfzhepiafo');
  e.setAttribute('data-stripe-id', cust);
  s.parentNode.insertBefore(e, s);
};

const setIntercomUser = (user) => {
  const w: any = window;

  w.intercomSettings = {
    app_id: 'umyv0iwz',
    name: `${user.first_name} ${user.last_name}`,
    email: user.email,
    created_at: moment(user.created_at).unix(),
  };
  console.log(w.intercomSettings);

  const ic = w.Intercom;
  console.log(ic);
  if (typeof ic === "function") {
    ic('reattach_activator');
    ic('update', w.intercomSettings);
  } else {
    const d = document;
    const i: any = function () {
      i.c(arguments);
    };
    i.q = [];
    i.c = function (args) { i.q.push(args); };
    w.Intercom = i;
    const l = function () {
      const s = d.createElement('script');
      s.type = 'text/javascript';
      s.async = true;
      s.src = 'https://widget.intercom.io/widget/umyv0iwz';
      const x = d.getElementsByTagName('script')[0];
      x.parentNode.insertBefore(s, x);
    };
    if (w.attachEvent) {
      w.attachEvent('onload', l);
    } else {
      w.addEventListener('load', l, false);
    }
  }
}

@Injectable()
export class AuthService {
  private _currentUser: BehaviorSubject<User> = new BehaviorSubject(new User());
  public readonly currentUser: Observable<User> = this._currentUser.asObservable();

  // If user was logged out when they tried to reach a route,
  // they can be redirected once logged in
  public redirectUrl: string;

  // Keep track if there is a current network call
  private fetchingUser: boolean;

  constructor(
    private http: HttpClient,
    private store: StoreService,
    private userService: UserService,
    private router: Router,
  ) {

    this.currentUser = this.currentUser.pipe(
      filter(u => !this.fetchingUser),
      map(u => new User(u)),
    );

  }


  /**
   *  Login by email and password
   *  Store user token
   *  @param  {string} email
   *  @param  {string} password
   *  @return {Promise}
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>('/auth/local', { email, password })
      .pipe(
        take(1),
        map(body => {
          this.store.set('userToken', body.token);

          Raven.setUserContext({
            email: body.user.email,
            name: body.user.name,
            id: body.user._id,
          });

          this._currentUser.next(body.user);
        }),
      );
  }

  /**
   *  Logout user by removing the user token
   */
  logout() {
    this.store.remove('userToken');
    this.setCookie('token', '', -1);
    this.router.navigate(['/login']);
    Raven.setUserContext();
    this._currentUser.next(new User());
  }

  /**
   *  Get current user
   *  @return {Observable<User>}
   */
  getCurrentUser(refresh?: boolean): Observable<User> {
    const current = this._currentUser.getValue();
    if (!current || !current._id) refresh = true;

    if (refresh) {
      this.fetchingUser = true;

      this.userService.getById('me').pipe(
        catchError(err => {
          this.fetchingUser = false;
          this._currentUser.next(new User());
          return this.currentUser;
        }),
        filter(u => !!u._id),
        first())
        .subscribe(u => {

          if (u.stripe) {
            setStunningBarCustomer(u.stripe.customerId);
          }
          setIntercomUser(u);

          this.fetchingUser = false;
          this._currentUser.next(u);
        });
    }
    return this.currentUser;
  }

  /**
   *  Test if user has role
   *
   *  @param  {string[]} roles Roles to check if user has
   *  @return {boolean}           Whether the user has the role or not.
   */
  hasRole(...roles: string[]): boolean {
    return roles.indexOf(this._currentUser.getValue().role) > -1;
  }

  /**
   * See if user has a given tier or above
   *
   * @param tiersNeeded - Check if user tier matches one of the tiers needed
   */
  hasTier(tiersNeeded: Array<string>): boolean {
    const u = this._currentUser.getValue();
    if (!u || !u.stripe) return false;
    return !!~tiersNeeded.indexOf(u.stripe.tier);
  }

  /**
   *  Returns whether user is logged in or not
   *  @return {Observable<boolean>} is
   */
  isLoggedIn(): Observable<boolean> {
    return this.getCurrentUser()
      .pipe(map(u => !!u.role));
  }

  // Create a user and authenticate
  signup(u: User): Observable<User> {
    return this.http.post<any>('/users', u).pipe(
      mergeMap(({ token, user }) => {
        this.store.set('userToken', token);
        this._currentUser.next(user);
        return this.currentUser;
      }));
  }

  oauthLogin(token: string) {
    this.store.set('userToken', token);
    return this.getCurrentUser(true).pipe(
      filter(u => !!u._id),
      first());
  }

  // Reset user password
  resetPassword(resetId: string, token: string, password: string): Observable<User> {
    return this.http.post<User>(`/password-reset/${resetId}?token=${token}`, { password });
  }

  // Update account with edits
  updateAccount(edits: any): Observable<User> {
    return this.http.put<User>(`/users/me`, edits).pipe(
      tap(u => this._currentUser.next(u)));
  }

  updateCard(token: any): Observable<any> {
    return this.http.put<any>(`/users/me/subscription/billing`, { token }).pipe(
      tap(billing => this._currentUser.next({ ...this._currentUser.getValue(), stripe: billing })),
      first());
  }

  /**
   * Update User subscription
   *
   * @param {Object} body
   * @param {string} body.token - Stripe token to update card
   * @param {string} body.tier
   * @param {string?} body.couponCode
   * @returns {Observable<any>}
   */
  updateSubscription(body: any): Observable<any> {

    return this.http.put<any>(`/users/me/subscription/billing`, { token: body.token })
      .pipe(
        switchMap(() => this.http.put<any>(`/users/me/subscription`, body)),
        tap(billing => {
          const updated = { ...this._currentUser.getValue(), stripe: billing };
          this._currentUser.next(updated);
        }),
      );
  }

  /**
   * Update User plan
   *
   * @param {Object} plan
   * @param {string} plan.frequency
   * @param {string} plan.tier
   * @param {string?} plan.couponCode
   * @returns {Observable<User>}
   */
  updatePlan(plan: any): Observable<User> {
    return this.http.put<User>(`/users/me/plan`, plan).pipe(
      tap(u => this._currentUser.next(u)));
  }

  getStripeCustomer() {
    return this.http.get<any>('/users/me/subscription').pipe(
      tap(cust => {
        const u = this._currentUser.getValue();
        u.customer = cust;
        this._currentUser.next(u);
      }));
  }

  updatePushSettings(push) {
    const data = JSON.parse(push);
    return this.http.post<any>(`/users/me/notifications/subscribe`, data);
  }

  updateNotificationSettings(settings) {
    return this.http.put<any>(`/users/me/notifications/settings`, settings);
  }

  updatePassword(oldPassword: string, newPassword: string): Observable<any> {
    return this.http.put<any>('/users/me/password', {
      oldPassword, newPassword,
    });
  }

  addPhotos(photos: { [type: string]: Blob }) {
    console.log(photos);
    const fd = new FormData();
    Object.keys(photos).map(type => fd.append(type, photos[type]));
    console.log(fd);

    return this.http.post<User>(`/users/me/photos`, fd).pipe(
      tap(u => this._currentUser.next(u)));
  }

  cancelSubscription(): Observable<any> {
    return this.http.post<User>('/users/me/cancelSubscription', {}).pipe(
      tap(u => this._currentUser.next(u)));
  }

  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  }

  getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

}
