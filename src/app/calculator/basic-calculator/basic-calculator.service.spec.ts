/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BasicCalculatorService } from './basic-calculator.service';

describe('Service: BasicCalculator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicCalculatorService]
    });
  });

  it('should ...', inject([BasicCalculatorService], (service: BasicCalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
