import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CurrencyConverterPage } from './currency-converter.page';

describe('CurrencyConverterPage', () => {
  let component: CurrencyConverterPage;
  let fixture: ComponentFixture<CurrencyConverterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CurrencyConverterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CurrencyConverterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

