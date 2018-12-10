import { filter, first, map, share, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';

import { CollectionService } from 'app/shared/collection.service';
import { SocketService } from 'app/core/socket.service';
import { Notification } from 'models/notification';
import { SwService } from 'app/core/sw.service';
import { AuthService } from './auth/auth.service';

@Injectable()
export class NotificationService extends CollectionService<Notification> {

  public readonly notifications$: Observable<Array<Notification>>;
  private unreadSubject = new BehaviorSubject<any>({});
  public readonly unread = this.unreadSubject.asObservable();

  private readonly displayOptions = {
    /* https://coolors.co/314b64-00a69a-ff5b62-86bbd8-f6ae2d */
    /* 2nd set https://coolors.co/314b64-00a69a-ff5b62-087e8b-ffc857 */
    'admin.issue': { icon: 'bug_report', color: '#bdd9e9' },
    'admin.report': { icon: 'flag', color: '#a33a3f' },
    'admin.application': { icon: 'assignment', color: '#7AAAC5' },
    'admin.signup': { icon: 'assignment', color: '#5A62B5' },

    'review': { icon: 'thumbs_up', color: '#f8c466' },
    'discount': { icon: 'free_breakfast', color: '#f87143' },
    'announcement': { icon: 'announcement', color: '#BA4348' },
    'application': { icon: 'assignment', color: '#7AAAC5' },
    'event': { icon: 'event', color: '#5A62B5' },
    'post': { icon: 'message', color: '#ED6571' },
    'post.comment': { icon: 'comment', color: '#2da6c5' },
    'post.comment.response': { icon: 'comment', color: '#2da6c5' },
    'account': { icon: 'account_box', color: '#00C1B4' },

    'default': { icon: 'announcement', color: '#00C1B4' },
  };


  constructor(
    private socketService: SocketService,
    private sw: SwService,
    private auth: AuthService,
    http: HttpClient
  ) {

    super(http);
    this.endpoint = '/users/me/notifications';

    // socketService.register('/notifications', {
    //   'create': this.onCreate.bind(this)
    // });

    this.notifications$ = this.collection$.pipe(
      filter(c => !!c.length),
      share(),
      tap(() => this.syncUnreadCount()),
      map(notifications => {

        return notifications.map(n => {
          let display = this.displayOptions[n.type];
          if (!display) {
            display = this.displayOptions['default'];
          }

          return Object.assign(n, {
            display: display,
            fromNow: moment(n.createdAt).fromNow()
          });
        });
      }),);

    this.auth.getCurrentUser()
      .subscribe(u => {
        const enable = Object.keys(u.notifications)
          .some(k => u.notifications[k].browser);

        if (enable) {
          this.registerPush();
        }
      });
  }

  registerPush() {
    if (!this.sw.supportsPush) return;

    return this.sw
      .registerPush()
      .then(sub => {
        if (!sub) return false;
        this.auth
          .getCurrentUser().pipe(
          first())
          .subscribe(u => {
            const existing = u.pushSubscriptions.find(p => p.endpoint === sub.endpoint);
            if (existing) return;

            this.auth
              .updatePushSettings(JSON.stringify(sub))
              .subscribe(() => {
              });
          });
      })
      .catch(err => {
        // Did not approve notifications
        return false;
      });
  }

  // on socket update
  onCreate(n) {
    const current = this._collection.getValue();
    current.unshift(n as Notification);
    this._collection.next(current);
  }

  /**
   * If a resource had a notification,
   * find it and mark it read
   *
   * @param {string} id of the resource
   * @param {string} key in notification data to match
   */
  markReadForResource(id: string, key: string) {
    const notifications = this._collection.getValue();
    const read = notifications.filter(n => n.data[key] === id);
    this.markRead(read);
  }

  /**
   * Mark read the given notifications
   * Also updates the unread count
   * @param  {Notification|Array<Notification>|string}    arg
   *         What to mark read,
   *         Accepts a notification, an array of notifications, or a type of notification
   */
  markRead(arg: any) {

    let toMark;
    const notifications = this._collection.getValue();

    if (Array.isArray(arg)) {
      toMark = arg.filter(n => !n.readAt);
    } else if (arg instanceof Object) {
      if (arg.readAt) return;
      toMark = [arg];
    } else { // arg is string (the type of notification)
      toMark = notifications
        .filter(n => n.type === arg && !n.read);

    }

    if (!toMark.length) return;

    toMark.forEach(n => {
      const i = notifications.findIndex(n2 => n2._id === n._id);
      Object.assign(notifications[i], { read: true, readAt: new Date() });
    });

    this.http.put<any>(`${this.endpoint}/read`, {
      notifications: toMark.map(n => n._id),
      type: arg instanceof String ? arg : null,
    })
      .subscribe(
        unread => {
          this.unreadSubject.next(unread);
          this._collection.next(notifications);
        },
        console.error,
      );
  }

  syncUnreadCount() {
    const counts = {};
    const notifications = this._collection.getValue();

    notifications.forEach(n => {
      if (n.readAt) return;
      counts[n.type] = counts[n.type] + 1 || 1;
    });

    this.unreadSubject.next(counts);
  }

}
