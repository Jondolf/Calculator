import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';
import { BasicCalculatorService } from './basic-calculator.service';
import { BasicCalculatorCustomStyles } from 'src/app/models/basic-calculator-custom-styles.interface';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-basic-calculator',
  templateUrl: './basic-calculator.page.html',
  styleUrls: ['./basic-calculator.page.scss'],
})
export class BasicCalculatorPage implements OnInit, OnDestroy {
  calculation = '0';
  currentResult = '';

  constructor(public calculator: BasicCalculatorService, public globals: GlobalVarsService) { }

  ngOnInit(): void {
    document.body.addEventListener('keydown', this.handleEvent);
    this.calculator.buttonStyles = this.calculator.getDefaultStyles();
    this.globals.currentCalculator = 'Basic calculator';
  }
  ngOnDestroy(): void {
    document.body.removeEventListener('keydown', this.handleEvent);
  }

  addSymbolToCalculation(symbol: string | number): void {
    /*
    If route has changed, remove keydown eventlistener. ngOnDestroy doesn't really work anymore, because Ionic keeps previous pages running.
    This made typing into other pages' inputs (on keyboard) impossible because the event listener with preventDefault() was still there.
    */
    if (this.globals.currentCalculator !== 'Basic calculator') {
      document.body.removeEventListener('keydown', this.handleEvent);
      return;
    }
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
      this.calculation = `=${this.calculator.countCalculation(this.calculation).toString()}`;
      this.currentResult = '';
      return;
    }
    // Reset calculation to defaults if first symbol of calculation is equals but equals symbol isn't pressed
    if (this.calculation[0] === '=') {
      this.calculation = '0';
      this.currentResult = '';
    }
    // Remove initial zero before first symbol is added
    if (this.calculation === '0') {
      this.calculation = '';
    }
    this.calculation += symbol.toString();
    this.currentResult = `=${this.calculator.countCalculation(this.calculation).toString()}`;
  }

  removeLastChar(str: string): string {
    return str.substring(0, str.length - 1);
  }

  backspaceEventHandler() {
    if (this.calculation.length === 1) {
      this.calculation = '0';
      this.currentResult = '';
    } else if (this.calculation[0] === '=') {
      this.calculation = '0';
      this.currentResult = '';
    } else {
      this.calculation = this.removeLastChar(this.calculation);
      this.currentResult = `=${this.calculator.countCalculation(this.calculation).toString()}`;
    }
  }

  handleEvent = (e: KeyboardEvent): void => {
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
      this.calculation = `=${this.calculator.countCalculation(this.calculation).toString()}`;
      this.currentResult = '';
    }
    // Remove
    if (e.key === 'Backspace') {
      this.backspaceEventHandler();
    }
  }
}
