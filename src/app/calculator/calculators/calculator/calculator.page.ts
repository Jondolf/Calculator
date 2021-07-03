import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { MathButton, MathButtonGrid } from '../../math-components/math-buttons/math-buttons.component';
import { MathCommand } from '../../math-components/math-command.type';
import { MathInputComponent } from '../../math-components/math-input/math-input.component';
import { MathEvaluatorService } from '../../math-evaluator/mathEvaluator.service';
import { CalculatorService } from './calculator.service';

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

  mathCommands: MathCommand[];

  smallMathBtnGrid: MathButtonGrid = {
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
    buttons: [],
  };
  mediumMathBtnGrid: MathButtonGrid = {
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
    buttons: []
  };
  largeMathBtnGrid: MathButtonGrid = {
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
    buttons: []
  };

  constructor(
    private changeDetector: ChangeDetectorRef,
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

  private get numberCommands(): MathCommand[] {
    const commands: MathCommand[] = [];
    for (const num of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) {
      commands.push({
        shortcuts: [`${num}`],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: [num],
        button: {
          name: `num-${num}`,
          displayName: num.toString(),
          class: 'math-button-primary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: [num]
        }
      });
    }
    return commands;
  }

  private get trigonometricFunctionCommands(): MathCommand[] {
    const that = this;
    const commands: MathCommand[] = [];
    for (const func of ['sin', 'cos', 'tan']) {
      commands.push(
        {
          shortcuts: [func[0]],
          command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          get commandArgs() {
            return [`${that.currentMathButtonGrid.isInversed ? 'a' : ''}${func}${that.currentMathButtonGrid.isHyperbolic ? 'h' : ''}`];
          },
          button: {
            name: func,
            get displayName() {
              return `${that.currentMathButtonGrid.isInversed ? 'a' : ''}${func}${that.currentMathButtonGrid.isHyperbolic ? 'h' : ''}`;
            },
            class: 'math-button-secondary',
            onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
            get onTapArgs() {
              return [`${that.currentMathButtonGrid.isInversed ? 'a' : ''}${func}${that.currentMathButtonGrid.isHyperbolic ? 'h' : ''}`];
            }
          }
        }
      );
    }
    return commands;
  }

  async ngOnInit() {
    this.globals.currentCalculator = 'Calculator';
  }

  ngAfterViewInit() {
    this.mathCommands = [
      ...this.numberCommands,
      ...this.trigonometricFunctionCommands,
      {
        shortcuts: ['.', ','],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['.'],
        button: {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['.']
        }
      },
      {
        shortcuts: ['Enter', '='],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['='],
        button: {
          name: 'equals',
          displayName: '=',
          class: 'math-button-primary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['=']
        }
      },
      {
        shortcuts: ['Escape'],
        command: this.mathInput.resetCalculation.bind(this.mathInput),
        commandArgs: [],
        button: {
          name: 'C',
          class: 'math-button-secondary',
          onTap: this.mathInput.resetCalculation.bind(this.mathInput),
          onTapArgs: []
        }
      },
      {
        shortcuts: ['('],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['('],
        button: {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['(']
        }
      },
      {
        shortcuts: [')'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: [')'],
        button: {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: [')']
        }
      },
      {
        shortcuts: ['Backspace'],
        command: this.mathInput.deletePrev.bind(this.mathInput),
        commandArgs: [],
        button: {
          iconName: 'backspace',
          class: 'math-button-secondary',
          onTap: this.mathInput.deletePrev.bind(this.mathInput),
          onPress: this.mathInput.resetCalculation.bind(this.mathInput)
        }
      },
      {
        shortcuts: ['+'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['+'],
        button: {
          name: 'plus',
          displayName: '+',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['+']
        }
      },
      {
        shortcuts: ['-'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['-'],
        button: {
          name: 'minus',
          displayName: '-',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['-']
        }
      },
      {
        shortcuts: ['*'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['*'],
        button: {
          name: 'multiply',
          displayName: 'x',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['*']
        }
      },
      {
        shortcuts: ['/'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['/'],
        button: {
          name: 'divide',
          displayName: '÷',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['/']
        }
      },
      {
        shortcuts: [],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['√'],
        button: {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['√']
        }
      },
      {
        shortcuts: ['^'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['^'],
        button: {
          name: 'pow',
          displayName: '^',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['^']
        }
      },
      {
        shortcuts: ['p'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['π'],
        button: {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['π']
        }
      },
      {
        shortcuts: ['e'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['e'],
        button: {
          name: 'e',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['e']
        }
      },
      {
        shortcuts: ['m'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['mod'],
        button: {
          name: 'mod',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['mod']
        }
      },
      {
        shortcuts: ['%'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['%'],
        button: {
          name: 'percent',
          displayName: 'n%',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['%']
        }
      },
      {
        shortcuts: ['!'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['!'],
        button: {
          name: 'factorial',
          displayName: 'n!',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['!']
        }
      },
      {
        shortcuts: [],
        command: () => this.currentMathButtonGrid.isInversed = !this.currentMathButtonGrid.isInversed,
        button: {
          name: 'Inv',
          class: 'math-button-secondary',
          onTap: () => this.currentMathButtonGrid.isInversed = !this.currentMathButtonGrid.isInversed
        }
      },
      {
        shortcuts: [],
        command: () => this.currentMathButtonGrid.isInversed = !this.currentMathButtonGrid.isInversed,
        button: {
          name: 'Hyp',
          class: 'math-button-secondary',
          onTap: () => this.currentMathButtonGrid.isHyperbolic = !this.currentMathButtonGrid.isHyperbolic
        }
      },
      {
        shortcuts: [],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['lb'],
        button: {
          name: 'lb',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['lb']
        }
      },
      {
        shortcuts: [],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['ln'],
        button: {
          name: 'ln',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['ln']
        }
      },
      {
        shortcuts: [],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['lg'],
        button: {
          name: 'lg',
          class: 'math-button-secondary',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['lg']
        }
      }
    ];
    const [smallGridBtnNames, mediumMathBtnGridBtnNames, largeGridBtnNames] = this.getGridBtnNames();
    const mathButtons = this.mathCommands.filter(command => command.button).map(command => command.button);
    this.smallMathBtnGrid.buttons = this.getButtonsByNames(mathButtons, smallGridBtnNames);
    this.mediumMathBtnGrid.buttons = this.getButtonsByNames(mathButtons, mediumMathBtnGridBtnNames);
    this.largeMathBtnGrid.buttons = this.getButtonsByNames(mathButtons, largeGridBtnNames);
    //? Tried to use { ...button, class: button.class + ' whatever' } but using the spread operator removed the getters used in trigonometricFunctionCommands, which didn't properly trigger a change when isInversed or isHyperbolic changed. Object.create worked.
    this.smallMathBtnGrid.buttons = this.smallMathBtnGrid.buttons.map(button => {
      const newButton = Object.create(button);
      newButton.class += ' lg-text';
      return newButton;
    });
    this.mediumMathBtnGrid.buttons = this.mediumMathBtnGrid.buttons.map(button => {
      const newButton = Object.create(button);
      newButton.class += ' md-text';
      return newButton;
    });
    this.largeMathBtnGrid.buttons = this.largeMathBtnGrid.buttons.map(button => {
      const newButton = Object.create(button);
      newButton.class += ' sm-text';
      return newButton;
    });
    this.changeDetector.detectChanges();
  }

  getGridBtnNames(): string[][] {
    return [
      this.smallMathBtnGrid.areas.replace(/["\n\s]+/g, ' ').trim().split(' '),
      this.mediumMathBtnGrid.areas.replace(/["\n\s]+/g, ' ').trim().split(' '),
      this.largeMathBtnGrid.areas.replace(/["\n\s]+/g, ' ').trim().split(' ')
    ];
  }

  getButtonsByNames(buttons: MathButton[], names: string[]): MathButton[] {
    return buttons.filter(button => names.some(name => [button.name, button.iconName].includes(name)));
  }

  onExprChange(newExpr: string) {
    this.expr = newExpr;
    this.currentResult = `=${this.mathEvaluator.evaluateAndFormat(newExpr, this.forceDeg)}`;
  }

  formatNumber(num: number | string): string {
    if (num.toString().includes('NaN')) {
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
