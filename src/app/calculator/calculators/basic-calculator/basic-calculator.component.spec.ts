import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicCalculatorComponent } from './basic-calculator.component';

describe('BasicCalculatorComponent', () => {
  let component: BasicCalculatorComponent;
  let fixture: ComponentFixture<BasicCalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicCalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
