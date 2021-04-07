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
      gridAreas: `
      "C     opening-parenthesis  closing-parenthesis backspace"
      "num-1 num-2                num-3               plus"
      "num-4 num-5                num-6               minus"
      "num-7 num-8                num-9               multiply"
      "num-0 dot                  equals              divide"
      `,
      buttons: [
        {
          name: 'num-1',
          displayName: '1',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1]
        },
        {
          name: 'num-2',
          displayName: '2',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2]
        },
        {
          name: 'num-3',
          displayName: '3',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3]
        },
        {
          name: 'num-4',
          displayName: '4',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
        },
        {
          name: 'num-5',
          displayName: '5',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
        },
        {
          name: 'num-6',
          displayName: '6',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
        },
        {
          name: 'num-7',
          displayName: '7',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
        },
        {
          name: 'num-8',
          displayName: '8',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
        },
        {
          name: 'num-9',
          displayName: '9',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
        },
        {
          name: 'num-0',
          displayName: '0',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'C',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
        },
        {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
        },
        {
          name: 'plus',
          displayName: '+',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
        },
      ]
    };
    this.mediumMathBtnGrid = {
      gridAreas: `
        "C     opening-parenthesis  closing-parenthesis backspace backspace"
        "num-1 num-2                num-3               plus      sqrt"
        "num-4 num-5                num-6               minus     pow"
        "num-7 num-8                num-9               multiply  pi"
        "num-0 dot                  equals              divide    e"
      `,
      buttons: [
        {
          name: 'num-1',
          displayName: '1',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1],
        },
        {
          name: 'num-2',
          displayName: '2',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2],
        },
        {
          name: 'num-3',
          displayName: '3',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3],
        },
        {
          name: 'num-4',
          displayName: '4',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
        },
        {
          name: 'num-5',
          displayName: '5',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
        },
        {
          name: 'num-6',
          displayName: '6',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
        },
        {
          name: 'num-7',
          displayName: '7',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
        },
        {
          name: 'num-8',
          displayName: '8',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
        },
        {
          name: 'num-9',
          displayName: '9',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
        },
        {
          name: 'num-0',
          displayName: '0',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'C',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
        },
        {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
        },
        {
          name: 'plus',
          displayName: '+',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
        },
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['e'],
        }
      ]
    };
    this.largeMathBtnGrid = {
      gridAreas: `
        "sin C       opening-parenthesis  closing-parenthesis backspace backspace"
        "cos percent factorial            mod                 backspace backspace"
        "tan num-1   num-2                num-3               plus      sqrt"
        "lb  num-4   num-5                num-6               minus     pow"
        "ln  num-7   num-8                num-9               multiply  pi"
        "lg  num-0   dot                  equals              divide    e"
      `,
      buttons: [
        {
          name: 'num-1',
          displayName: '1',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [1],
        },
        {
          name: 'num-2',
          displayName: '2',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [2],
        },
        {
          name: 'num-3',
          displayName: '3',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [3],
        },
        {
          name: 'num-4',
          displayName: '4',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [4],
        },
        {
          name: 'num-5',
          displayName: '5',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [5],
        },
        {
          name: 'num-6',
          displayName: '6',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [6],
        },
        {
          name: 'num-7',
          displayName: '7',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [7],
        },
        {
          name: 'num-8',
          displayName: '8',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [8],
        },
        {
          name: 'num-9',
          displayName: '9',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [9],
        },
        {
          name: 'num-0',
          displayName: '0',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [0],
        },
        {
          name: 'C',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: [],
        },
        {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: [')'],
        },
        {
          iconName: 'backspace',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput),
        },
        {
          name: 'plus',
          displayName: '+',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['='],
        },
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['e'],
        },
        {
          name: 'mod',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['mod'],
        },
        {
          name: 'percent',
          displayName: 'n%',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['%'],
        },
        {
          name: 'factorial',
          displayName: 'n!',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['!'],
        },
        {
          name: 'sin',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['sin'],
        },
        {
          name: 'cos',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['cos'],
        },
        {
          name: 'tan',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['tan'],
        },
        {
          name: 'lb',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['lb'],
        },
        {
          name: 'ln',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['ln'],
        },
        {
          name: 'lg',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToCalculation.bind(this.mathInput),
          onTapArgs: ['lg'],
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
