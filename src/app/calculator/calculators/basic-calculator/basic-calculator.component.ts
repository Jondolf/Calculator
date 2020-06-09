import {
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { BasicCalculatorService } from './basic-calculator.service';

@Component({
  selector: 'app-basic-calculator',
  templateUrl: './basic-calculator.component.html',
  styleUrls: ['./basic-calculator.component.scss'],
})
export class BasicCalculatorComponent implements OnInit, OnDestroy {
  calculation = '0';
  currentResult = '';

  constructor(public calculator: BasicCalculatorService) { }

  ngOnInit(): void {
    document.body.addEventListener('keydown', this.handleEvent);
  }
  ngOnDestroy(): void {
    document.body.removeEventListener('keydown', this.handleEvent);
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
    // Don't allow operator as first symbol
    if (operators.includes(symbol.toString()) && this.calculation === '0') {
      return;
    }
    // Parentheses restrictions
    if (symbol === '(' && (numberSymbols.includes(lastSymbolOfCalc.toString()) || lastSymbolOfCalc === ')')) {
      return;
    } else if (symbol === ')' && operators.includes(lastSymbolOfCalc)) {
      console.log('Return');
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
