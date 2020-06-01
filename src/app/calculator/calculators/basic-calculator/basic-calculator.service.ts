import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BasicCalculatorService {
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
    return result;
  }

  countPow(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '^');
    const numbers = numberStrings.map((numberString: string) => {
      if (numberString[0] === '(') {
        const calc = numberString.substr(1, numberString.length - 2);
        // Recursive
        return this.countPlus(calc);
      }
      if (numberString === 'π') {
        return Math.PI;
      }
      if (numberString === 'e') {
        return Math.exp(1);
      }
      return +numberString;
    });
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number | string) => acc ** +num, intitialValue);
    return result;
  }

  // /
  countDivide(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '/');
    const numbers = numberStrings.map((numberString: string) => this.countPow(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc / +num, intitialValue);
    return result;
  }
  // *, /
  countMultiply(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '*');
    const numbers = numberStrings.map((numberString: string) => this.countDivide(numberString));
    const intitialValue = 1.0;
    const result = numbers.reduce((acc: number, num: number) => acc * num, intitialValue);
    return result;
  }
  // -, *, /
  countMinus(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '-');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countMultiply(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc - num, intitialValue);
    return result;
  }
  // +, -, *, /
  countPlus(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '+');
    const numbers: number[] = numberStrings.map((numberString: string) => this.countMinus(numberString));
    const intitialValue = 0.0;
    const result = numbers.reduce((acc: number, num: number) => acc + num, intitialValue);
    return result;
  }

  countCalculation(calculation: string): number {
    // With proper code math operators (*, /) instead of x and ÷
    const realCalculation = calculation.replace(/x/g, '*').replace(/÷/g, '/');
    const result = this.countPlus(realCalculation);
    // console.log('Result', realCalculation, result);
    return result;
  }
}
