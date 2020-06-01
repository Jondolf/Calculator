import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoreCommandsMenuComponent } from './more-commands-menu.component';

describe('MoreCommandsMenuComponent', () => {
  let component: MoreCommandsMenuComponent;
  let fixture: ComponentFixture<MoreCommandsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoreCommandsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoreCommandsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
