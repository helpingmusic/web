import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAnnouncementModalComponent } from './edit-announcement-modal.component';

describe('EditTrackModalComponent', () => {
  let component: EditAnnouncementModalComponent;
  let fixture: ComponentFixture<EditAnnouncementModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAnnouncementModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAnnouncementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
