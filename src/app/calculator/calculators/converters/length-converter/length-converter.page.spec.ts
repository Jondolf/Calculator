import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LengthConverterPage } from './length-converter.page';

describe('LengthConverterPage', () => {
  let component: LengthConverterPage;
  let fixture: ComponentFixture<LengthConverterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LengthConverterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LengthConverterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
