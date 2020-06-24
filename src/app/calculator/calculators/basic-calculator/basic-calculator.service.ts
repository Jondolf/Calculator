import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BasicCalculatorCustomStyles } from 'src/app/models/basic-calculator-custom-styles.interface';

import Decimal from 'decimal.js';

@Injectable({
  providedIn: 'root'
})
export class BasicCalculatorService {
  // Not related to logic
  isBasicCalculatorButtonSettingsMenuOpen: boolean;
  buttonStyles = this.getDefaultStyles();

  constructor(private storage: Storage) {
    this.storage.get('basicCalculatorCustomStyles').then(val => {
      if (val) {
        this.buttonStyles = val;
      }
    });
  }

  getDefaultStyles() {
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
  countCalculation(calculation: string): string {
    /*
    Replace calculation symbols with working code math operators (*, / etc.) instead of x and ÷ etc.
    Each of these "commands" has to be one symbol long, so some names are a bit random like the logarithm names.
    */
    const realCalculation = calculation.replace(/x/g, '*').replace(/÷/g, '/').replace(/mod/g, 'm') // multiply, divide, modulo
      .replace(/sin/g, 's').replace(/cos/g, 'c').replace(/tan/g, 't') // sin, cos, tan
      .replace(/log/g, 'f').replace(/ln/g, 'g').replace(/lg/g, 'h') // log base 10, log base e, log base 2 (the letters are random)
      .replace(/([0-9πe])π/g, '$1*π').replace(/([0-9πe])e/g, '$1*e') // replace ππ and ee with π*π and e*e
      .replace(/(\))([\(0-9πe])/g, '$1*$2')
      .replace(/([0-9πe])(\()/g, '$1*$2');
    const result = this.countPlus(realCalculation);
    return result.toFixed();
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
  countPlus(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, '+');
    const numbers: Decimal[] = numberStrings.map((numberString: string) => this.countMinus(numberString));
    const intitialValue = new Decimal(0.0);
    const result = numbers.reduce((acc: Decimal, num: Decimal) => acc.plus(num), intitialValue);
    return result;
  }
  // -, *, /, **, %
  countMinus(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, '-');
    const numbers: Decimal[] = numberStrings.map((numberString: string) => this.countMultiply(numberString));
    const intitialValue = new Decimal(numbers[0]);
    const result = numbers.slice(1).reduce((acc: Decimal, num: Decimal) => acc.minus(num), intitialValue);
    return result;
  }
  // *, /, **, %
  countMultiply(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, '*');
    const numbers = numberStrings.map((numberString: string) => this.countDivide(numberString));
    const intitialValue = new Decimal(1.0);
    const result = numbers.reduce((acc: Decimal, num: Decimal) => acc.mul(num), intitialValue);
    return result;
  }
  // /, **, %
  countDivide(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, '/');
    const numbers = numberStrings.map((numberString: string) => this.countPow(numberString));
    const intitialValue = new Decimal(numbers[0]);
    const result = numbers.slice(1).reduce((acc: Decimal, num: Decimal) => acc.div(num), intitialValue);
    return result;
  }
  // **, %
  countPow(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, '^');
    const numbers = numberStrings.map((numberString: string) => this.countModulo(numberString));
    const intitialValue = new Decimal(numbers[0]);
    const result = numbers.slice(1).reduce((acc: Decimal, num: Decimal) => acc.pow(num), intitialValue);
    return result;
  }
  // %
  countModulo(calculation: string): Decimal {
    const numberStrings: string[] = this.split(calculation, 'm'); // m means modulo here because % is already it's own command
    const numbers = numberStrings.map((numberString: string) => {
      if (numberString[0] === '(') {
        const calc = numberString.substr(1, numberString.length - 2);
        // Recursive
        return this.countPlus(calc);
      }
      if (numberString === 'π') {
        return Decimal.acos(-1); // Pi
      }
      if (numberString === 'e') {
        return Decimal.exp(1);
      }
      if (numberString[0] === '√' && numberString.length > 1) {
        return Decimal.sqrt(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 's' /* sin */ && numberString.length > 1) {
        return Decimal.sin(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'c' /* cos */ && numberString.length > 1) {
        return Decimal.cos(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 't' /* tan */ && numberString.length > 1) {
        return Decimal.tan(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'f' /* log */ && numberString.length > 1) {
        return Decimal.log10(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'g' /* ln */ && numberString.length > 1) {
        return Decimal.ln(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[0] === 'h' /* lg */ && numberString.length > 1) {
        return Decimal.log2(this.countPlus(numberString.substring(1, numberString.length)));
      }
      if (numberString[numberString.length - 1] === '%' && numberString.length > 1) {
        return this.countPlus(numberString.substring(0, numberString.length - 1)).div(100);
      }
      if (numberString[numberString.length - 1] === '!' && numberString.length > 1) {
        return this.countFactorial(this.countPlus(numberString.substring(0, numberString.length - 1)));
      }
      return new Decimal(numberString);
    });
    const intitialValue = new Decimal(numbers[0]);
    const result = numbers.slice(1).reduce((acc: Decimal, num: Decimal) => acc.mod(num), intitialValue);
    return result;
  }

  countFactorial(num: Decimal): Decimal {
    // Avoid ridiculously large numbers for better performance
    if (num.greaterThan(200)) {
      return new Decimal(Infinity);
    }
    let result = new Decimal(1);
    for (let i = 2; new Decimal(i).lessThanOrEqualTo(num); i++) {
      result = result.times(i);
    }
    return result;
  }
}
