import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MassConverterComponent } from './mass-converter.component';

describe('MassConverterComponent', () => {
  let component: MassConverterComponent;
  let fixture: ComponentFixture<MassConverterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MassConverterComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MassConverterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
