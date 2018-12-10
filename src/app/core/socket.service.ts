import { distinctUntilKeyChanged, filter } from 'rxjs/operators';
import { Injectable } from '@angular/core';

import io from 'socket.io-client';

import { AuthService } from 'app/core/auth/auth.service';

@Injectable()
export class SocketService {

  userId: string;
  // queue register requests until user id is available
  queue: Array<Function> = [];
  private namespaces: any = {};

  constructor(private auth: AuthService) {

    auth.getCurrentUser().pipe(
      filter(u => !!u._id),
      distinctUntilKeyChanged('_id'),)
      .subscribe(u => {
        this.userId = u._id;

        // clear queue
        this.queue.forEach(fn => fn());
        this.queue = [];
      });
  }

  register(namespace: string, events: any = {}) {
    if (!this.userId) { // need user id to connect to socket
      this.queue.push(this.register.bind(this, namespace, events));
      return;
    }

    this.namespaces[namespace] = io(namespace, {
      query: { user: this.userId },
    });

    for (const e in events) {
      if (!events.hasOwnProperty(e)) continue;
      this.namespaces[namespace].on(e, events[e]);
    }
  }

}
