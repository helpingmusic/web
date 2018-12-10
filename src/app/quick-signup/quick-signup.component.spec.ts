import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickSignupComponent } from './quick-signup.component';

describe('QuickSignupComponent', () => {
  let component: QuickSignupComponent;
  let fixture: ComponentFixture<QuickSignupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuickSignupComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
