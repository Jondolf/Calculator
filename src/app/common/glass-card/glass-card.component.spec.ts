/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GlassCardComponent } from './glass-card.component';

describe('GlassCardComponent', () => {
  let component: GlassCardComponent;
  let fixture: ComponentFixture<GlassCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GlassCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GlassCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
