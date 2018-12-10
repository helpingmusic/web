import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadPhotoModalComponent } from './upload-photo-modal.component';

describe('UploadPhotoModalComponent', () => {
  let component: UploadPhotoModalComponent;
  let fixture: ComponentFixture<UploadPhotoModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPhotoModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadPhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
