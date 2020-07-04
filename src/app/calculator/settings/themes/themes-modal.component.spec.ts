import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemesModalComponent } from './themes-modal.component';

describe('ThemesModalComponent', () => {
  let component: ThemesModalComponent;
  let fixture: ComponentFixture<ThemesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ThemesModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
