import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInputComponent } from './audio-input.component';

describe('AudioInputComponent', () => {
  let component: AudioInputComponent;
  let fixture: ComponentFixture<AudioInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AudioInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
