/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BasicCalculatorService } from './basic-calculator.service';

fdescribe('Service: BasicCalculator', () => {
  let service: BasicCalculatorService;

  beforeEach(() => {
    service = new BasicCalculatorService();
    TestBed.configureTestingModule({
      providers: [BasicCalculatorService]
    });
  });

  it('should ...', inject([BasicCalculatorService], (calcService: BasicCalculatorService) => {
    expect(calcService).toBeTruthy();
  }));
  const calculationsToTest: [string, number][] = [
    // single operators
    ['1+2', 3],
    ['10-8', 2],
    ['1+4', 5],
    ['10-8', 2],
    ['4*5', 20],
    ['15÷2', 7.5],
    ['5^3', 125],
    ['5mod2', 1],
    // constants
    ['π', Math.PI],
    ['e', Math.E],
    // square root
    ['√64', 8],
    // mathematical functions
    ['sin(3.14)', Math.sin(3.14)],
    ['cos(3.14)', Math.cos(3.14)],
    ['tan(3.14)', Math.tan(3.14)],
    ['log(5)', Math.log10(5)],
    ['ln(5)', Math.log(5)],
    ['lg(5)', Math.log2(5)],
    // percent and factorial
    ['25%', 0.25],
    ['10!', 3628800],
    // more complex calculations
    ['5+2x3', 11],
    ['(5+2)x3', 21],
    ['2π', 2 * Math.PI],
    ['2e', 2 * Math.E],
    ['-5x(5+2)', -35],
    ['√(-5x(-25)÷5)', 5],
  ];

  for (const [calculation, result] of calculationsToTest) {
    it(`should calculate: ${calculation} = ${result}`, () => {
      expect(service.countCalculation(calculation)).toBe(result);
    });
  }

  // calculations that are not .toBe(x)
  it('should return 0.916904', () => {
    expect(service.countCalculation('√(sin(cos(tan(log(ln(lg(π*e)))))))')).toBeCloseTo(0.91690404711);
  });
});
