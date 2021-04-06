import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { MathEvaluatorService } from '../../math-evaluator/mathEvaluator.service';
import { CalculatorService } from './calculator.service';
import { MathButtonGrid } from './math-buttons/math-buttons.component';
import { MathInputComponent } from './math-input/math-input.component';

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.page.html',
  styleUrls: ['./calculator.page.scss']
})
export class CalculatorPage implements OnInit, AfterViewInit {
  @ViewChild('mathInput') mathInput: MathInputComponent;

  expr = '';
  currentResult = '';
  forceDeg = false;

  smallMathBtnGrid: MathButtonGrid;
  mediumMathBtnGrid: MathButtonGrid;
  largeMathBtnGrid: MathButtonGrid;

  constructor(
    public calculator: CalculatorService,
    public mathEvaluator: MathEvaluatorService,
    public globals: GlobalVarsService) { }

  async ngOnInit() {
    this.globals.currentCalculator = 'Calculator';
  }

  ngAfterViewInit() {
    this.smallMathBtnGrid = {
      rows: '1fr 1fr 1fr 1fr 1fr',
      columns: '1fr 1fr 1fr 1fr',
      buttons: [
        {
          name: '1',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1],
          rows: '2/3',
          columns: '1/2'
        },
        {
          name: '2',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2],
          rows: '2/3',
          columns: '2/3'
        },
        {
          name: '3',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3],
          rows: '2/3',
          columns: '3/4'
        },
        {
          name: '4',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
          rows: '3/4',
          columns: '1/2'
        },
        {
          name: '5',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
          rows: '3/4',
          columns: '2/3'
        },
        {
          name: '6',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
          rows: '3/4',
          columns: '3/4'
        },
        {
          name: '7',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
          rows: '4/5',
          columns: '1/2'
        },
        {
          name: '8',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
          rows: '4/5',
          columns: '2/3'
        },
        {
          name: '9',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
          rows: '4/5',
          columns: '3/4'
        },
        {
          name: '0',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '5/6',
          columns: '1/2'
        },
        {
          name: '.',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '5/6',
          columns: '2/3'
        },
        {
          name: 'C',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
          rows: '1/2',
          columns: '1/2'
        },
        {
          name: '(',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
          rows: '1/2',
          columns: '2/3'
        },
        {
          name: ')',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
          rows: '1/2',
          columns: '3/4'
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
          rows: '1/2',
          columns: '4/5'
        },
        {
          name: '+',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
          rows: '2/3',
          columns: '4/5'
        },
        {
          name: '-',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
          rows: '3/4',
          columns: '4/5'
        },
        {
          name: 'x',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
          rows: '4/5',
          columns: '4/5'
        },
        {
          name: '÷',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
          rows: '5/6',
          columns: '4/5'
        },
        {
          name: '=',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
          rows: '5/6',
          columns: '3/4'
        },
      ]
    };
    this.mediumMathBtnGrid = {
      rows: '1fr 1fr 1fr 1fr 1fr',
      columns: '1fr 1fr 1fr 1fr 1fr',
      buttons: [
        {
          name: '1',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1],
          rows: '2/3',
          columns: '1/2'
        },
        {
          name: '2',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2],
          rows: '2/3',
          columns: '2/3'
        },
        {
          name: '3',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3],
          rows: '2/3',
          columns: '3/4'
        },
        {
          name: '4',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
          rows: '3/4',
          columns: '1/2'
        },
        {
          name: '5',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
          rows: '3/4',
          columns: '2/3'
        },
        {
          name: '6',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
          rows: '3/4',
          columns: '3/4'
        },
        {
          name: '7',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
          rows: '4/5',
          columns: '1/2'
        },
        {
          name: '8',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
          rows: '4/5',
          columns: '2/3'
        },
        {
          name: '9',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
          rows: '4/5',
          columns: '3/4'
        },
        {
          name: '0',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '5/6',
          columns: '1/2'
        },
        {
          name: '.',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '5/6',
          columns: '2/3'
        },
        {
          name: 'C',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
          rows: '1/2',
          columns: '1/2'
        },
        {
          name: '(',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
          rows: '1/2',
          columns: '2/3'
        },
        {
          name: ')',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
          rows: '1/2',
          columns: '3/4'
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
          rows: '1/2',
          columns: '4/6'
        },
        {
          name: '+',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
          rows: '2/3',
          columns: '4/5'
        },
        {
          name: '-',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
          rows: '3/4',
          columns: '4/5'
        },
        {
          name: 'x',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
          rows: '4/5',
          columns: '4/5'
        },
        {
          name: '÷',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
          rows: '5/6',
          columns: '4/5'
        },
        {
          name: '=',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
          rows: '5/6',
          columns: '3/4'
        },
        {
          name: '√',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['√'],
          rows: '2/3',
          columns: '5/5'
        },
        {
          name: '^',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['^'],
          rows: '3/4',
          columns: '5/5'
        },
        {
          name: 'π',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['π'],
          rows: '4/5',
          columns: '5/5'
        },
        {
          name: 'e',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['e'],
          rows: '5/6',
          columns: '5/5'
        }
      ]
    };
    this.largeMathBtnGrid = {
      rows: '1fr 1fr 1fr 1fr 1fr 1fr',
      columns: '1fr 1fr 1fr 1fr 1fr 1fr',
      buttons: [
        {
          name: '1',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1],
          rows: '3/4',
          columns: '2/3'
        },
        {
          name: '2',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2],
          rows: '3/4',
          columns: '3/4'
        },
        {
          name: '3',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3],
          rows: '3/4',
          columns: '4/5'
        },
        {
          name: '4',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
          rows: '4/5',
          columns: '2/3'
        },
        {
          name: '5',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
          rows: '4/5',
          columns: '3/4'
        },
        {
          name: '6',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
          rows: '4/5',
          columns: '4/5'
        },
        {
          name: '7',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
          rows: '5/6',
          columns: '2/3'
        },
        {
          name: '8',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
          rows: '5/6',
          columns: '3/4'
        },
        {
          name: '9',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
          rows: '5/6',
          columns: '4/5'
        },
        {
          name: '0',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '6/7',
          columns: '2/3'
        },
        {
          name: '.',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
          rows: '6/7',
          columns: '3/4'
        },
        {
          name: 'C',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
          rows: '1/2',
          columns: '2/3'
        },
        {
          name: '(',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
          rows: '1/2',
          columns: '3/4'
        },
        {
          name: ')',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
          rows: '1/2',
          columns: '4/5'
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
          rows: '1/3',
          columns: '5/7'
        },
        {
          name: '+',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
          rows: '3/4',
          columns: '5/6'
        },
        {
          name: '-',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
          rows: '4/5',
          columns: '5/6'
        },
        {
          name: 'x',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
          rows: '5/6',
          columns: '5/6'
        },
        {
          name: '÷',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
          rows: '6/7',
          columns: '5/6'
        },
        {
          name: '=',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
          rows: '6/7',
          columns: '4/5'
        },
        {
          name: '√',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['√'],
          rows: '3/4',
          columns: '6/7'
        },
        {
          name: '^',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['^'],
          rows: '4/5',
          columns: '6/7'
        },
        {
          name: 'π',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['π'],
          rows: '5/6',
          columns: '6/7'
        },
        {
          name: 'e',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['e'],
          rows: '6/7',
          columns: '6/7'
        },
        {
          name: 'mod',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['mod'],
          rows: '2/3',
          columns: '4/5'
        },
        {
          name: 'n%',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['%'],
          rows: '2/3',
          columns: '2/3'
        },
        {
          name: 'n!',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['!'],
          rows: '2/3',
          columns: '3/4'
        },
        {
          name: 'sin',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['sin'],
          rows: '1/2',
          columns: '1/2'
        },
        {
          name: 'cos',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['cos'],
          rows: '2/3',
          columns: '1/2'
        },
        {
          name: 'tan',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['tan'],
          rows: '3/4',
          columns: '1/2'
        },
        {
          name: 'lb',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['lb'],
          rows: '4/5',
          columns: '1/2'
        },
        {
          name: 'ln',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['ln'],
          rows: '5/6',
          columns: '1/2'
        },
        {
          name: 'lg',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['lg'],
          rows: '6/7',
          columns: '1/2'
        }
      ]
    };
  }

  onExprChange(newExpr: string) {
    this.expr = newExpr;
    this.currentResult = `=${this.mathEvaluator.evaluateAndFormat(newExpr, this.forceDeg)}`;
  }

  formatNumber(num: number | string): string {
    const numSplitAtDot = num.toString().includes('.') ? num.toString().split('.') : [num.toString()];
    // Add spaces between digits, but not to the decimals e.g. 1 250 010.12504
    const formattedNum = numSplitAtDot.length === 1
      ? this.addSpacesToNumber(numSplitAtDot[0])
      : `${this.addSpacesToNumber(numSplitAtDot[0])}.${numSplitAtDot[1]}`;
    return formattedNum;
  }

  addSpacesToNumber(num: number | string): string {
    // First remove all spaces, then add the correct spaces
    return num.toString().replace(/ /, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  }
}
