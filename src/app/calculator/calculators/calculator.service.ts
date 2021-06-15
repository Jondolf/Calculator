import { Injectable } from '@angular/core';

/**
 * The normal, more performant version of the calculator's logic that doesn't use decimal.js.
 * Good when precision isn't as important and performance is the main priority.
 */
@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  isDeg = false; // Default is radians but can be changed to degrees

  countCalculation(calculation: string): number {
    try {
      this.checkForInvalidMathFunctions(calculation);
      const formattedCalculation = this.formatCalculation(calculation);
      this.checkIfAllParenthesesClosed(formattedCalculation);
      const result: number = this.countPlus(formattedCalculation);
      return result;
    } catch {
      return NaN;
    }
  }

  /**
   * Checks if the calculation given by the user includes the one letter versions of the mathematical functions.
   * If yes, it should throw an error.
   */
  checkForInvalidMathFunctions(calculation: string): void | Error {
    const invalidFunctions = ['a', 'b', 'c', 'd', 'f', 'h', 'i', 'm'];
    if (invalidFunctions.some(mathFunc => calculation.includes(mathFunc + '(')) && calculation) {
      throw new Error('Incorrect math function name.');
    }
  }

  checkIfAllParenthesesClosed(calculation: string): void | Error {
    if (calculation.replace(/[^(]/g, '').length !== calculation.replace(/[^)]/g, '').length) {
      throw new Error('All parentheses must be closed.');
    }
  }

  /**
   * Replaces calculation symbols with working code math operators (*, / etc.) instead of x and ÷ etc.
   * Each of these "commands" has to be one symbol long, so the letters for sin, cos, tan, log, ln and lg are alphabetically chosen,
   * but some letters (like e) were skipped to avoid problems where the letter was already in use.
   */
  formatCalculation(calculation: string): string {
    return calculation
      .replace(/x/g, '*').replace(/÷/g, '/').replace(/mod/g, 'm') // multiply, divide, modulo
      .replace(/sin/g, 'a').replace(/cos/g, 'b').replace(/tan/g, 'c') // sin, cos, tan
      .replace(/log/g, 'd').replace(/ln/g, 'f').replace(/lg/g, 'h') // log base 10, log base e, log base 2 (the letters are random)
      .replace(/abs/g, 'i') // abs
      .replace(/sqrt/g, '√').replace(/pi/g, 'π')
      .replace(/([0-9πe])π/g, '$1*π').replace(/([0-9πe])e/g, '$1*e') // Replace ππ and ee with π*π and e*e
      .replace(/(\))([\(0-9πe])/g, '$1*$2') // Replace calculations like (5+5)2 and (5+5)(1+1) with (5+5)*2 and (5+5)*(1+1)
      .replace(/([0-9πe])(\()/g, '$1*$2') // Replace calculations like 3(5+5) with 3*(5+5)
      .replace(/(\))([%])/g, '$1/100'); // Replace calculations like (2+3)% with (2+3)/100;
  }

  split(calculation: string, operator: string): string[] {
    const result = [];
    let braces = 0;
    let currentChunk = '';
    for (const currentChar of calculation) {
      if (currentChar === '(') {
        braces++;
      } else if (currentChar === ')') {
        braces--;
      }
      if (braces === 0 && operator === currentChar) {
        result.push(currentChunk);
        currentChunk = '';
      } else { currentChunk += currentChar; }
    }
    if (currentChunk !== '') {
      result.push(currentChunk);
    }
    if (operator === '-' && result[0] === '') {
      result[0] = '0';
    }
    return result;
  }

  // +, -, *, /, **, %
  countPlus(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '+');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countMinus(numberString));
    const intitialValue = 0.0;
    const result = numbers.reduce((acc: number, num: number) => acc + num, intitialValue);
    return result;
  }
  // -, *, /, **, %
  countMinus(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '-');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countMultiply(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc - num, intitialValue);
    return result;
  }
  // *, /, **, %
  countMultiply(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '*');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countDivide(numberString));
    const intitialValue = 1.0;
    const result = numbers.reduce((acc: number, num: number) => acc * num, intitialValue);
    return result;
  }
  // /, **, %
  countDivide(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '/');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countPow(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc / num, intitialValue);
    return result;
  }
  // **, %
  countPow(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '^');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countModulo(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc ** num, intitialValue);
    return result;
  }
  // %
  countModulo(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, 'm'); // m means modulo here because % is already it's own command
    const numbers: number[] = numberStrings.map((numberString: string) => {
      if (numberString[0] === '(') {
        const calc = numberString.substr(1, numberString.length - 2);
        // Recursive
        return this.countPlus(calc);
      }
      if (numberString === 'π') {
        return Math.PI; // pi
      }
      if (numberString === 'e') {
        return Math.E; // euler
      }

      if (numberString.length > 1) {
        // Mathematical functions, like sin(...)
        const calculatedStringAfterMathFunction: number = this.countPlus(numberString.substring(1, numberString.length));
        switch (numberString[0]) {
          case '√': // square root
            return Math.sqrt(calculatedStringAfterMathFunction);
          case 'a': // sin
            return this.isDeg
              ? Math.sin(this.convertToRadians(calculatedStringAfterMathFunction))
              : Math.sin(calculatedStringAfterMathFunction);
          case 'b': // cos
            return this.isDeg ?
              Math.cos(this.convertToRadians(calculatedStringAfterMathFunction))
              : Math.cos(calculatedStringAfterMathFunction);
          case 'c': // tan
            return this.isDeg
              ? Math.tan(this.convertToRadians(calculatedStringAfterMathFunction))
              : Math.tan(calculatedStringAfterMathFunction);
          case 'd': // log
            return Math.log10(calculatedStringAfterMathFunction);
          case 'f': // ln
            return Math.log(calculatedStringAfterMathFunction);
          case 'h': // lg
            return Math.log2(calculatedStringAfterMathFunction);
          case 'i': // abs
            return Math.abs(calculatedStringAfterMathFunction);
        }
      }
      // Mathematical functions where the function is after the number, like 25% or 10!
      const stringBeforeMathFunction: string = numberString.substring(0, numberString.length - 1);
      switch (numberString[numberString.length - 1]) {
        case '%': // percent
          return this.countPlus(stringBeforeMathFunction) / 100;
        case '!': // factorial
          return this.countFactorial(this.countPlus(stringBeforeMathFunction));
      }
      return +numberString;
    });
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc % num, intitialValue);
    return result;
  }

  countFactorial(num: number): number {
    // Avoid ridiculously large numbers for better performance
    if (num > 200) {
      return Infinity;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result = result * i;
    }
    return result;
  }

  convertToRadians(angle: number): number {
    return angle * (Math.PI / 180);
  }
}
