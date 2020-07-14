import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TemperatureConverterPage } from './temperature-converter.page';

describe('TemperatureConverterPage', () => {
  let component: TemperatureConverterPage;
  let fixture: ComponentFixture<TemperatureConverterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemperatureConverterPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TemperatureConverterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
