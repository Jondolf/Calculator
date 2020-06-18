import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MassConverterPage } from './mass-converter.page';

describe('MassConverterPage', () => {
  let component: MassConverterPage;
  let fixture: ComponentFixture<MassConverterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MassConverterPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MassConverterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
