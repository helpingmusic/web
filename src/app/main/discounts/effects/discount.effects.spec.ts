import { TestBed, inject } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { DiscountEffects } from './discount.effects';

describe('DiscountEffects', () => {
  let actions$: Observable<any>;
  let effects: DiscountEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DiscountEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(DiscountEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
