import { async, getTestBed, TestBed } from '@angular/core/testing';

import { BaseRequestOptions, Http, Response, ResponseOptions } from '@angular/http';

import { MockBackend, MockConnection } from '@angular/http/testing';

import { AuthService } from 'app/core/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { StoreService } from 'app/core/store.service';
import { UserService } from 'app/core/user/user.service';

describe('AuthService', () => {
  let backend: MockBackend;
  let auth: AuthService;
  let store: StoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        HttpClient,
        StoreService,
        UserService,
        BaseRequestOptions,
        MockBackend,
        {
          deps: [
            MockBackend,
            BaseRequestOptions
          ],
          provide: Http,
          // useFactory: (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
          //   return new Http(backend, defaultOptions);
          // }
        }
      ]
    });

    const testbed = getTestBed();
    backend = testbed.get(MockBackend);
    auth = testbed.get(AuthService);
    store = testbed.get(StoreService);
    store.clearAll();

  }));

  function setConnectionResponse(url: string, options: any) {
    backend.connections.subscribe((connection: MockConnection) => {
      const req = connection.request;
      if (req.url === url) {
        console.log(`${req.method} ${req.url}`);
        const responseOptions = new ResponseOptions(options);
        const response = new Response(responseOptions);
        connection.mockRespond(response);
      }
    });
  }

  it('#login should save token & currentUser', (done: any) => {

    setConnectionResponse('/auth/local', {
      body: {
        token: 'testLoginToken',
        user: { _id: '123', role: 'member' }
      }
    });
    setConnectionResponse('/users/me', {
      body: { error: 'Forbidden' },
      status: 403,
    });

    return auth.getCurrentUser()
      .toPromise()
      .then(u => {
        expect(u._id).toBeUndefined(); // start with no user
      })
      .then(() => auth.login('test@example.com', 'test'))
      .then(() => auth.getCurrentUser().toPromise())
      .then(u => {
        expect(store.get('userToken')).toBe('testLoginToken');
        expect(u._id).toBe('123');
        done();
      });
  });

  // it('#logout should destroy userToken and current user', (done: any) => {
  //   setConnectionResponse('/auth/local', {
  //     body: {
  //       token: 'testLogoutToken',
  //       user: { _id: '123', role: 'member' }
  //     }
  //   });
  //
  //   return auth.login('test@example.com', 'test')
  //     .then(() => auth.getCurrentUser().toPromise())
  //     .then(u => {
  //       expect(u._id).toBeDefined();
  //       expect(store.get('userToken')).toBe('testLogoutToken');
  //       auth.logout();
  //       return auth.getCurrentUser().toPromise();
  //     })
  //     .then(u => {
  //       expect(u._id).toBeUndefined();
  //       expect(store.get('userToken')).toBeUndefined();
  //
  //       done();
  //     });
  // });
});
