import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { AnnouncementEffects } from './announcement.effects';

describe('AnnouncementEffects', () => {
  let actions$: Observable<any>;
  let effects: AnnouncementEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AnnouncementEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AnnouncementEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
