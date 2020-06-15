import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { LengthConverterComponent } from './length-converter.component';

describe('LengthConverterComponent', () => {
  let component: LengthConverterComponent;
  let fixture: ComponentFixture<LengthConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LengthConverterComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(LengthConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
