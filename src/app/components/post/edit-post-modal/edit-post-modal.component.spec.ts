import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPostModalComponent } from './edit-post-modal.component';

describe('EditReviewModalComponent', () => {
  let component: EditPostModalComponent;
  let fixture: ComponentFixture<EditPostModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPostModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPostModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
