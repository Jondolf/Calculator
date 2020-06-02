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
    if (this.calculation[this.calculation.length - 1] === ')' && (symbol === '+' || symbol === '-' || symbol === 'x' || symbol === '÷')) {
      this.calculation += symbol.toString();
      this.currentResult = `=${this.calculator.countCalculation(this.calculation).toString()}`;
      return;
    }
    if ((symbol !== '(' && symbol !== ')' && symbol !== '^' && symbol !== '√' && symbol !== '%' && symbol !== 'π' && symbol !== 'e')
      && (isNaN(+symbol) && isNaN(+this.calculation[this.calculation.length - 1]))
      || (isNaN(+symbol) && this.calculation.length === 0)) {
      return;
    }
    if (symbol === '(' && !isNaN(+this.calculation[this.calculation.length - 1]) || this.calculation[this.calculation.length - 1] === ')') {
      return;
    } else if (symbol === ')' && isNaN(+this.calculation[this.calculation.length - 1])) {
      return;
    }
    if (symbol === '=') {
      this.calculation = `=${this.calculator.countCalculation(this.calculation).toString()}`;
      this.currentResult = '';
      return;
    }
    if (this.calculation[0] === '=') {
      this.calculation = '0';
      this.currentResult = '';
    }
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
