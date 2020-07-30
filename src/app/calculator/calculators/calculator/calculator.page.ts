import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CalculatorService } from './calculator.service';
import { PreciseCalculatorService } from '../precise-calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Subscription } from 'rxjs';
import Decimal from 'decimal.js';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('calculationRef') calculationRef: ElementRef;
  calculationElement: HTMLElement;

  calculation = '';
  currentResult = '';

  isCalculatorMenuVisibleSubscription: Subscription;

  constructor(
    public calculator: CalculatorService,
    public preciseCalculator: PreciseCalculatorService,
    public globals: GlobalVarsService) { }

  ngOnInit() {
    document.addEventListener('keydown', this.handleEvent);
    this.globals.currentCalculator = 'Calculator';
    this.isCalculatorMenuVisibleSubscription = this.globals.isCalculatorMenuOpenChange.subscribe((isOpen: boolean) => {
      isOpen
        ? document.removeEventListener('keydown', this.handleEvent)
        : document.addEventListener('keydown', this.handleEvent);
    });
  }
  ngOnDestroy() {
    document.removeEventListener('keydown', this.handleEvent);
    this.isCalculatorMenuVisibleSubscription.unsubscribe();
  }
  ngAfterViewInit() {
    this.calculationElement = this.calculationRef.nativeElement;
  }

  handleEvent = (e: KeyboardEvent): void => {
    /*
    If route has changed, remove keydown eventlistener. ngOnDestroy doesn't really work anymore, because Ionic keeps previous pages running.
    This made typing into other pages' inputs (on keyboard) impossible because the event listener with preventDefault() was still there.
    */
    if (this.globals.currentCalculator !== 'Calculator' || this.globals.isCalculatorMenuOpen) {
      document.removeEventListener('keydown', this.handleEvent);
      return;
    }
    e.preventDefault();
    if (e.key === ' ') {
      return;
    }
    // Numbers
    if (+e.key >= 0 && +e.key <= 9) {
      this.addSymbolToCalculation(e.key);
    }
    // Plus, minus, pow, percent, factorial
    if ('+-^%!'.includes(e.key)) {
      this.addSymbolToCalculation(e.key);
    }
    // Multiply and divide
    if (e.key === '*' || e.key === '/') {
      this.addSymbolToCalculation(e.key === '*' ? 'x' : '÷');
    }
    // Decimal separator
    if (e.key === '.') {
      this.addSymbolToCalculation(e.key);
    }
    // Parentheses
    if (e.key === '(' || e.key === ')') {
      this.addSymbolToCalculation(e.key);
    }
    // Get result
    if (this.calculation[0] !== '=' && (e.key === 'Enter' || e.key === '=')) {
      if (this.calculation[0] !== '=') {
        this.calculation = `=${this.formatNumber(this.countCalculation())}`;
      }
      this.currentResult = '';
    }
    // Remove
    if (e.key === 'Backspace') {
      this.backspaceEventHandler();
    }
  }

  addSymbolToCalculation(symbol: string | number): void {
    if (symbol === 'Enter') {
      return;
    }

    const operators = ['+', '-', 'x', '÷', '^', 'mod', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
    const numberSymbols = '0123456789πe';
    const lastSymbolOfCalc = this.calculation[this.calculation.length - 1];

    // Don't allow two operators in a row
    if (this.calculation !== '' && operators.includes(symbol.toString()) && operators.includes(lastSymbolOfCalc)) {
      return;
    }
    // Don't allow two decimal separators in a row
    if (symbol.toString() === '.' && lastSymbolOfCalc === '.') {
      return;
    }
    // Don't allow operator as first symbol (except minus symbol)
    if (operators.includes(symbol.toString()) && this.calculation === '' && symbol !== '-') {
      return;
    }
    // Parentheses restrictions
    if (symbol === '(' && (numberSymbols.includes(lastSymbolOfCalc) || lastSymbolOfCalc === ')') && this.calculation !== '') {
      return;
    } else if (symbol === ')' && operators.includes(lastSymbolOfCalc)) {
      return;
    } else if (operators.includes(symbol.toString()) && lastSymbolOfCalc === '(' && symbol !== '-') {
      return;
    }
    // Don't allow numbers right after closing parentheses
    if (numberSymbols.includes(symbol.toString()) && lastSymbolOfCalc === ')') {
      return;
    }
    // Calculate calculation and clear current result field if equals symbol is pressed
    if (symbol.toString() === '=') {
      if (this.calculation[0] !== '=') {
        this.calculation = `=${this.preciseCalculator.countCalculation(this.calculation).toString()}`;
      }
      this.currentResult = '';
      this.calculationElement.scrollLeft = 0;
      return;
    }
    // Reset calculation to defaults if first symbol of calculation is equals but equals symbol isn't pressed
    if (this.calculation[0] === '=') {
      this.resetCalculation();
    }
    this.calculation = this.calculation + symbol.toString();
    if (this.calculation[0] !== '=') {
      this.currentResult = `=${this.countCalculation()}`;
    }
    if (this.calculationElement) {
      this.calculationElement.scrollLeft = this.calculationElement.scrollWidth;
    }
  }

  backspaceEventHandler(): void {
    if (this.calculation.length === 1 || this.calculation[0] === '=') {
      this.resetCalculation();
    } else if (this.checkIfTwoCharMathFunction()) {
      this.calculation = this.calculation.slice(0, this.calculation.length - 2);
      this.calculation === '' ? this.resetCalculation() : this.calculation = this.calculation;
    } else if (this.checkIfThreeCharMathFunction()) {
      this.calculation = this.calculation.slice(0, this.calculation.length - 3);
      this.calculation === '' ? this.resetCalculation() : this.calculation = this.calculation;
    } else {
      this.calculation = this.removeLastChar(this.calculation);
    }
    if (this.calculation !== '') {
      this.currentResult = `=${this.countCalculation()}`;
    }
    if (this.calculationElement) {
      this.calculationElement.scrollLeft = this.calculationElement.scrollWidth;
    }
  }

  countCalculation(): string {
    const result = this.preciseCalculator.countCalculation(this.calculation);
    const significantDigits = 15;
    const amountOfDigits: number = result.toString().replace(/\./g, '').length;
    const roundedResult = amountOfDigits > significantDigits
      ? result.toPrecision(significantDigits) // If there are more digits than significantDigits, use scientific notation
      : result.toFixed(); // Else just remove leftover zeroes
    return roundedResult;
  }

  removeLastChar(str: string): string {
    return str.slice(0, str.length - 1);
  }

  formatNumber(num: number | string | Decimal): string {
    const numSplitAtDot = num.toString().includes('.') ? num.toString().split('.') : [num.toString()];
    // Add spaces between digits, but not to the digits e.g. 1 250 010.12504
    const formattedNum = numSplitAtDot.length === 1
      ? this.addSpacesToNumber(numSplitAtDot[0])
      : `${this.addSpacesToNumber(numSplitAtDot[0])}.${numSplitAtDot[1]}`;
    return formattedNum;
  }

  addSpacesToNumber(num: number | string | Decimal): string {
    // First remove all spaces, then add the correct spaces
    return num.toString().replace(/ /, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }

  resetCalculation(): void {
    this.calculation = '';
    this.currentResult = '';
  }

  // Used for deleting entire words
  checkIfTwoCharMathFunction(): boolean {
    const twoCharMathFunctions = 'ln lg';
    const twoLastLettersOfCalculation = this.calculation.slice(this.calculation.length - 2);
    return twoCharMathFunctions.includes(twoLastLettersOfCalculation);
  }
  // Used for deleting entire words
  checkIfThreeCharMathFunction(): boolean {
    const threeCharMathFunctions = 'mod sin cos tan log';
    const threeLastLettersOfCalculation = this.calculation.slice(this.calculation.length - 3);
    return threeCharMathFunctions.includes(threeLastLettersOfCalculation);
  }
}
