/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('Service: Calculator', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatorService]
    });
  });

  it('should ...', inject([CalculatorService], (service: CalculatorService) => {
    expect(service).toBeTruthy();
  }));
});
