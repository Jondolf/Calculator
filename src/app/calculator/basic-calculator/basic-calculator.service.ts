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

  // /
  countDivide(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '/');
    const numbers = numberStrings.map((numberString: string) => {
      if (numberStrings[0] === '(') {
        const calc = numberString.substr(1, numberStrings.length - 2);
        // Recursive
        return this.countPlus(calc);
      }
      return +numberString;
    });
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc / num, intitialValue);
    return result;
  }
  // *, /
  countMultiply(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '*');
    console.log('Count multiply split', calculation, numberStrings);
    const numbers = numberStrings.map((numberString: string) => this.countDivide(numberString));
    const intitialValue = 1.0;
    const result = numbers.reduce((acc: number, num: number) => acc * num, intitialValue);
    console.log('Count multiply result', calculation, numbers, result);
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
    console.log('Count plus split', calculation, numberStrings);
    const numbers: number[] = numberStrings.map((numberString: string) => this.countMinus(numberString));
    const intitialValue = 0.0;
    const result = numbers.reduce((acc: number, num: number) => acc + num, intitialValue);
    console.log('Count plus result', calculation, result);
    return result;
  }

  countCalculation(calculation: string): number {
    // With proper code math operators (*, /) instead of x and ÷
    const realCalculation = calculation.replace(/x/g, '*').replace(/÷/g, '/');
    const result = this.countPlus(realCalculation);
    console.log(realCalculation, result);
    return result;
  }
}
