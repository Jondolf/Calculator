/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { GraphingCalculatorControlPanelComponent } from './graphing-calculator-control-panel.component';

describe('GraphingCalculatorControlPanelComponent', () => {
  let component: GraphingCalculatorControlPanelComponent;
  let fixture: ComponentFixture<GraphingCalculatorControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphingCalculatorControlPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphingCalculatorControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
