import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomizeButtonsModalComponent } from './customize-buttons-modal.component';

describe('CustomizeButtonsModalComponent', () => {
  let component: CustomizeButtonsModalComponent;
  let fixture: ComponentFixture<CustomizeButtonsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomizeButtonsModalComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomizeButtonsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
