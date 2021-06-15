import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { MathEvaluatorService } from '../../math-evaluator/mathEvaluator.service';
import { CalculatorService } from './calculator.service';
import { MathButton, MathButtonGrid } from './math-buttons/math-buttons.component';
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

  get currentMathButtonGrid(): MathButtonGrid {
    if (this.calculator.gridStyles.gridSize === 'small') {
      return this.smallMathBtnGrid;
    } else if (this.calculator.gridStyles.gridSize === 'medium') {
      return this.mediumMathBtnGrid;
    } else if (this.calculator.gridStyles.gridSize === 'large') {
      return this.largeMathBtnGrid;
    } else {
      return this.smallMathBtnGrid;
    }
  }

  private get numberButtons(): MathButton[] {
    const buttons: MathButton[] = [];
    for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      buttons.push({
        name: `num-${num}`,
        displayName: num.toString(),
        class: `math-button-primary ${this.calculator.gridStyles.gridSize === 'small' ? 'sm' : (this.calculator.gridStyles.gridSize === 'medium' ? 'md' : 'lg')}-text`,
        onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        onTapArgs: [num]
      });
    }
    return buttons;
  }

  private get trigonometricFunctionButtons(): MathButton[] {
    const buttons: MathButton[] = [];
    console.log(this.currentMathButtonGrid.isInversed);
    const currentMathButtonGrid = this.currentMathButtonGrid;
    for (const func of ['sin', 'cos', 'tan']) {
      buttons.push(
        {
          name: func,
          get displayName() {
            return `${currentMathButtonGrid.isInversed ? 'a' : ''}${func}${currentMathButtonGrid.isHyperbolic ? 'h' : ''}`;
          },
          class: `math-button-secondary ${this.calculator.gridStyles.gridSize === 'small' ? 'sm' : (this.calculator.gridStyles.gridSize === 'medium' ? 'md' : 'lg')}-text`,
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          get onTapArgs() {
            return [`${currentMathButtonGrid.isInversed ? 'a' : ''}${func}${currentMathButtonGrid.isHyperbolic ? 'h' : ''}`];
          }
        }
      );
    }
    return buttons;
  }

  async ngOnInit() {
    this.globals.currentCalculator = 'Calculator';
  }

  ngAfterViewInit() {
    this.smallMathBtnGrid = {
      areas: `
      "C     opening-parenthesis  closing-parenthesis backspace"
      "num-1 num-2                num-3               plus"
      "num-4 num-5                num-6               minus"
      "num-7 num-8                num-9               multiply"
      "num-0 dot                  equals              divide"
      `,
      width: 4,
      height: 5,
      isInversed: false,
      isHyperbolic: false,
      buttons: [
        ...this.numberButtons,
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['.'],
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary lg-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['='],
        },
      ]
    };
    this.mediumMathBtnGrid = {
      areas: `
        "C     opening-parenthesis  closing-parenthesis backspace backspace"
        "num-1 num-2                num-3               plus      sqrt"
        "num-4 num-5                num-6               minus     pow"
        "num-7 num-8                num-9               multiply  pi"
        "num-0 dot                  equals              divide    e"
      `,
      width: 5,
      height: 5,
      isInversed: false,
      isHyperbolic: false,
      buttons: [
        ...this.numberButtons,
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['.'],
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['='],
        },
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-secondary md-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['e'],
        }
      ]
    };
    this.largeMathBtnGrid = {
      areas: `
        "C   percent factorial mod    backspace backspace"
        "Inv sin     cos       tan    opening-parenthesis closing-parenthesis"
        "Hyp num-1   num-2     num-3  plus      sqrt"
        "lb  num-4   num-5     num-6  minus     pow"
        "ln  num-7   num-8     num-9  multiply  pi"
        "lg  num-0   dot       equals divide    e"
      `,
      width: 6,
      height: 6,
      isInversed: false,
      isHyperbolic: false,
      buttons: [
        ...this.numberButtons,
        {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['.'],
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
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
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['+'],
        },
        {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['-'],
        },
        {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['x'],
        },
        {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['÷'],
        },
        {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['='],
        },
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['e'],
        },
        {
          name: 'mod',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['mod'],
        },
        {
          name: 'percent',
          displayName: 'n%',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['%'],
        },
        {
          name: 'factorial',
          displayName: 'n!',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['!'],
        },
        ...this.trigonometricFunctionButtons,
        {
          name: 'Inv',
          class: 'math-button-secondary sm-text',
          onTap: () => {
            this.smallMathBtnGrid.isInversed = !this.smallMathBtnGrid.isInversed;
            this.mediumMathBtnGrid.isInversed = !this.mediumMathBtnGrid.isInversed;
            this.largeMathBtnGrid.isInversed = !this.largeMathBtnGrid.isInversed;
          }
        },
        {
          name: 'Hyp',
          class: 'math-button-secondary sm-text',
          onTap: () => {
            this.smallMathBtnGrid.isHyperbolic = !this.smallMathBtnGrid.isHyperbolic;
            this.mediumMathBtnGrid.isHyperbolic = !this.mediumMathBtnGrid.isHyperbolic;
            this.largeMathBtnGrid.isHyperbolic = !this.largeMathBtnGrid.isHyperbolic;
            console.log(this.largeMathBtnGrid.isHyperbolic);
          }
        },
        {
          name: 'lb',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['lb'],
        },
        {
          name: 'ln',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['ln'],
        },
        {
          name: 'lg',
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
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
    if (num.toString().includes('NaN')) {
      console.log(num, this.mathEvaluator.evaluateAndFormat(this.expr, this.forceDeg));
      return 'Invalid input';
    }
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
