import { Injectable } from '@angular/core';
import { BasicCalculatorCustomStyles } from 'src/app/models/basic-calculator-custom-styles.interface';

@Injectable({
  providedIn: 'root'
})
export class BasicCalculatorService {
  // Not related to logic
  isBasicCalculatorButtonSettingsMenuOpen: boolean;
  buttonStyles: BasicCalculatorCustomStyles;

  getDefaultStyles(): BasicCalculatorCustomStyles {
    return {
      gridSize: 'small',
      gridGap: '0px',
      buttonStyles: {
        'border-radius': '0px',
        'border-width': '1px'
      }
    } as BasicCalculatorCustomStyles;
  }

  // Logic
  /**
   * Counts the calculation by calling other functions and formatting the given calculation.
   * @param calculation A string representing the calculation to count. For example, 2x(3+7)
   */
  countCalculation(calculation: string): number {
    /*
    Replace calculation symbols with working code math operators (*, / etc.) instead of x and ÷ etc.
    Each of these "commands" has to be one symbol long, so some names are a bit random like the logarithm names.
    */
    const realCalculation = calculation.replace(/x/g, '*').replace(/÷/g, '/').replace(/mod/g, 'm') // multiply, divide, modulo
      .replace(/sin/g, 's').replace(/cos/g, 'c').replace(/tan/g, 't') // sin, cos, tan
      .replace(/log/g, 'f').replace(/ln/g, 'g').replace(/lg/g, 'h') // log base 10, log base e, log base 2 (the letters are random)
      .replace(/([0-9πe])π/g, '$1*π').replace(/([0-9πe])e/g, '$1*e'); // replace ππ and ee with π*π and e*e
    const result = this.countPlus(realCalculation);
    return result;
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
    const numbers = numberStrings.map((numberString: string) => this.countDivide(numberString));
    const intitialValue = 1.0;
    const result = numbers.reduce((acc: number, num: number) => acc * num, intitialValue);
    return result;
  }
  // /, **, %
  countDivide(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '/');
    const numbers = numberStrings.map((numberString: string) => this.countPow(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc / +num, intitialValue);
    return result;
  }
  // **, %
  countPow(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, '^');
    const numbers = numberStrings.map((numberString: string) => this.countModulo(numberString));
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number | string) => acc ** +num, intitialValue);
    return result;
  }
  // %
  countModulo(calculation: string): number {
    const numberStrings: string[] = this.split(calculation, 'm'); // m means modulo here because % is already it's own command
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
      if (numberString[0] === '√' && numberString.length > 1) {
        return Math.sqrt(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 's' /* sin */ && numberString.length > 1) {
        return Math.sin(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'c' /* cos */ && numberString.length > 1) {
        return Math.cos(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 't' /* tan */ && numberString.length > 1) {
        return Math.tan(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'f' /* log */ && numberString.length > 1) {
        return Math.log10(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'g' /* ln */ && numberString.length > 1) {
        return Math.log(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'h' /* lg */ && numberString.length > 1) {
        return Math.log2(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[numberString.length - 1] === '%' && numberString.length > 1) {
        return this.countPlus(numberString.substring(0, numberString.length - 1)) / 100;
      }
      if (numberString[numberString.length - 1] === '!' && numberString.length > 1) {
        return this.countFactorial(this.countPlus(numberString.substring(0, numberString.length - 1)));
      }
      return +numberString;
    });
    const intitialValue = numbers[0];
    const result = numbers.slice(1).reduce((acc: number, num: number) => acc % +num, intitialValue);
    return result;
  }

  countFactorial(num: number): number {
    // Avoid ridiculously large numbers for better performance
    if (num > 200) {
      return Infinity;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  }
}
