import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChartsPage } from './charts.page';

describe('ChartsPage', () => {
  let component: ChartsPage;
  let fixture: ComponentFixture<ChartsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
