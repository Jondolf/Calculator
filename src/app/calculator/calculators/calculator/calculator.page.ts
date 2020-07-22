import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CalculatorService } from './calculator.service';
import { PreciseCalculatorService } from '../precise-calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss'],
})
export class CalculatorPage implements OnInit, OnDestroy {
  calculation = '0';
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
  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.handleEvent);
    this.isCalculatorMenuVisibleSubscription.unsubscribe();
  }

  addSymbolToCalculation(symbol: string | number): void {
    if (symbol === 'Enter') {
      return;
    }

    const operators = ['+', '-', 'x', '÷', '^', 'mod', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
    const numberSymbols = '0123456789πe';
    const lastSymbolOfCalc = this.calculation[this.calculation.length - 1];

    // Don't allow two operators in a row
    if (operators.includes(symbol.toString()) && operators.includes(lastSymbolOfCalc.toString())) {
      return;
    }
    // Don't allow operator as first symbol (except minus symbol)
    if (operators.includes(symbol.toString()) && this.calculation === '0' && symbol !== '-') {
      return;
    }
    // Parentheses restrictions
    if (symbol === '(' && (numberSymbols.includes(lastSymbolOfCalc.toString()) || lastSymbolOfCalc === ')') && this.calculation !== '0') {
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
      this.calculation = `=${this.preciseCalculator.countCalculation(this.calculation).toString()}`;
      this.currentResult = '';
      return;
    }
    // Reset calculation to defaults if first symbol of calculation is equals but equals symbol isn't pressed
    if (this.calculation[0] === '=') {
      this.resetCalculation();
    }
    // Remove initial zero before first symbol is added
    if (this.calculation === '0') {
      this.calculation = '';
    }
    this.calculation += symbol.toString();
    this.currentResult = `=${this.preciseCalculator.countCalculation(this.calculation).toString()}`;
  }

  removeLastChar(str: string): string {
    return str.substring(0, str.length - 1);
  }

  backspaceEventHandler() {
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
    if (this.calculation !== '0') {
      this.currentResult = `=${this.preciseCalculator.countCalculation(this.calculation).toString()}`;
    }
  }

  resetCalculation() {
    this.calculation = '0';
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
    // Plus and minus
    if (e.key === '+' || e.key === '-') {
      this.addSymbolToCalculation(e.key);
    }
    // Multiply and divide
    if (e.key === '*' || e.key === '/') {
      this.addSymbolToCalculation(e.key === '*' ? 'x' : '÷');
    }
    // Parentheses
    if (e.key === '(' || e.key === ')') {
      this.addSymbolToCalculation(e.key);
    }
    // Get result
    if (this.calculation[0] !== '=' && (e.key === 'Enter' || e.key === '=')) {
      this.calculation = `=${this.preciseCalculator.countCalculation(this.calculation).toString()}`;
      this.currentResult = '';
    }
    // Remove
    if (e.key === 'Backspace') {
      this.backspaceEventHandler();
    }
  }
}
