import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorMenuModalComponent } from './calculator-menu-modal.component';

describe('CalculatorMenuModalComponent', () => {
  let component: CalculatorMenuModalComponent;
  let fixture: ComponentFixture<CalculatorMenuModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorMenuModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorMenuModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
