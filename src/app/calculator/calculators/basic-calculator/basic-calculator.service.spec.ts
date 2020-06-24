/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing';
import { BasicCalculatorService } from './basic-calculator.service';
import Decimal from 'decimal.js';
import { Storage } from '@ionic/storage';

fdescribe('Service: BasicCalculator', () => {
  let service: BasicCalculatorService;
  const storage = new Storage({});

  beforeEach(() => {
    service = new BasicCalculatorService(storage);
    TestBed.configureTestingModule({
      providers: [BasicCalculatorService]
    });
  });

  it('should ...', inject([BasicCalculatorService], (calcService: BasicCalculatorService) => {
    expect(calcService).toBeTruthy();
  }));
  const calculationsToTest: [string, number | Decimal][] = [
    // Single operators
    ['1+2', 3],
    ['10-8', 2],
    ['1+4', 5],
    ['10-8', 2],
    ['4*5', 20],
    ['15÷2', 7.5],
    ['5^3', 125],
    ['5mod2', 1],
    // Constants
    ['π', Math.PI],
    ['e', Math.E],
    // Square root
    ['√64', 8],
    // Mathematical functions
    ['sin(3.14)', Math.sin(3.14)],
    ['cos(3.14)', Math.cos(3.14)],
    ['tan(3.14)', Math.tan(3.14)],
    ['log(5)', Math.log10(5)],
    ['ln(5)', Math.log(5)],
    ['lg(5)', Math.log2(5)],
    // Percent and factorial
    ['25%', 0.25],
    ['10!', 3628800],
    // More complex calculations
    ['5+2x3', 11],
    ['(5+2)x3', 21],
    ['2π', 2 * Math.PI],
    ['2e', 2 * Math.E],
    ['-5x(5+2)', -35],
    ['√(-5x(-25)÷5)', 5],
    ['√(sin(cos(tan(log(ln(lg(π*e)))))))', 0.91690404711]
  ];

  for (const [calculation, result] of calculationsToTest) {
    it(`should calculate: ${calculation} = ${result}`, () => {
      expect(+service.countCalculation(calculation)).toBeCloseTo(+result);
    });
  }
});
