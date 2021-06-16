import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { CalculatorMenuComponent } from './calculator-menu.component';


describe('CalculatorMenuComponent', () => {
  let component: CalculatorMenuComponent;
  let fixture: ComponentFixture<CalculatorMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CalculatorMenuComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalculatorMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
