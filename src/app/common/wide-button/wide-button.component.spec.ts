import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WideButtonComponent } from './wide-button.component';

describe('WideButtonComponent', () => {
  let component: WideButtonComponent;
  let fixture: ComponentFixture<WideButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WideButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WideButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
