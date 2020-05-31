import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FullscreenContainerComponent } from './fullscreen-container.component';

describe('FullscreenContainerComponent', () => {
  let component: FullscreenContainerComponent;
  let fixture: ComponentFixture<FullscreenContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FullscreenContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FullscreenContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
