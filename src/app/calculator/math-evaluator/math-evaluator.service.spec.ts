import { inject, TestBed } from '@angular/core/testing';
import { MathEvaluatorService } from './math-evaluator.service';

const mathEvaluator = new MathEvaluatorService();

fdescribe('Service: MathEvaluator', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MathEvaluatorService]
    });
  });

  it('should ...', inject([MathEvaluatorService], (calcService: MathEvaluatorService) => {
    expect(calcService).toBeTruthy();
  }));
  const calculationsToTest: [string, number][] = [
    // Operators
    ['1 + 2', 3],
    ['10 - 8', 2],
    ['4 * 5', 20],
    ['15 / 2', 7.5],
    ['5 ^ 3', 125],
    ['5 mod 2', 1],
    // Constants
    ['π', Math.PI],
    ['e', Math.E],
    // Square root
    ['√64', 8],
    // Mathematical functions
    ['sin(3.14)', Math.sin(3.14)],
    ['cos(3.14)', Math.cos(3.14)],
    ['tan(3.14)', Math.tan(3.14)],
    ['asin(0.64)', Math.asin(0.64)],
    ['acos(0.64)', Math.acos(0.64)],
    ['atan(0.64)', Math.atan(0.64)],
    ['sinh(0.64)', Math.sinh(0.64)],
    ['cosh(0.64)', Math.cosh(0.64)],
    ['tanh(0.64)', Math.tanh(0.64)],
    ['asinh(0.64)', Math.asinh(0.64)],
    ['acosh(3.14)', Math.acosh(3.14)],
    ['atanh(0.64)', Math.atanh(0.64)],
    ['lb(5)', Math.log2(5)],
    ['ln(5)', Math.log(5)],
    ['lg(5)', Math.log10(5)],
    // Percent and factorial
    ['25%', 0.25],
    ['10!', 3628800],
    // Syntax
    ['1.32π + 6.4e', 21.5439],
    ['πe', 8.5397],
    ['5(5-2)', 15],
    ['π(2(4.5 + 6)(5 - 3.2))(2e / π)', 205.5021],
    ['sin 3.14', Math.sin(3.14)],
    // More complex calculations
    ['5 + 2 * 3', 11],
    ['(5 + 2) * 3', 21],
    ['-5 * (5 + 2)', -35],
    ['√(-5x(-25) / 5)', 5],
    ['√(sin(cos(tan(lg(ln(lb(π * e)))))))', 0.91690404711]
  ];

  for (const [calculation, result] of calculationsToTest) {
    it(`should calculate: ${calculation} = ${result}`, async () => {
      await mathEvaluator.isReady;
      expect(+mathEvaluator.evaluate(calculation, false)).toBeCloseTo(+result);
    });
  }
});
