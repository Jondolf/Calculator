import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GraphingCalculatorPage } from './graphing-calculator.page';

describe('GraphingCalculatorPage', () => {
  let component: GraphingCalculatorPage;
  let fixture: ComponentFixture<GraphingCalculatorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraphingCalculatorPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GraphingCalculatorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
