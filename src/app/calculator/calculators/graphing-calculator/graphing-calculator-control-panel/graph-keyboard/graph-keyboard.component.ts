import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MathButtonGrid } from 'src/app/calculator/math-components/math-buttons/math-buttons.component';
import { MathCommand } from 'src/app/calculator/math-components/math-command.type';
import { MathInputComponent } from 'src/app/calculator/math-components/math-input/math-input.component';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { Graph } from '../../graphs';

@Component({
  selector: 'graph-keyboard',
  templateUrl: './graph-keyboard.component.html',
  styleUrls: ['./graph-keyboard.component.scss']
})
export class GraphKeyboardComponent implements AfterViewInit {
  @ViewChild('mathInput') mathInput: MathInputComponent;

  @Input() evalExpr: (expr: string) => number | string;
  @Input() graph: Graph;
  @Output() close = new EventEmitter<void>();
  @Output() equationChange = new EventEmitter<string>();

  grid: MathButtonGrid = {
    areas: `
    "C   percent factorial mod    backspace backspace"
    "Inv sin     cos       tan    opening-parenthesis closing-parenthesis"
    "Hyp num-1   num-2     num-3  plus      sqrt"
    "lb  num-4   num-5     num-6  minus     pow"
    "ln  num-7   num-8     num-9  multiply  pi"
    "lg  num-0   dot       x      divide    e"
    `,
    width: 6,
    height: 6,
    isInversed: false,
    isHyperbolic: false,
    buttons: []
  };
  mathCommands: MathCommand[];
  isInversed = false;
  isHyperbolic = false;
  gridStyles: CalculatorCustomStyles = {
    gridSize: 'small',
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

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
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: [num]
        }
      });
    }
    return commands;
  }

  private get trigonometricFunctionCommands(): MathCommand[] {
    const commands: MathCommand[] = [];
    for (const func of ['sin', 'cos', 'tan']) {
      commands.push(
        {
          shortcuts: [func[0]],
          command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          get commandArgs() {
            return [`${this.isInversed ? 'a' : ''}${func}${this.isHyperbolic ? 'h' : ''}`];
          },
          button: {
            name: func,
            get displayName() {
              return `${this.isInversed ? 'a' : ''}${func}${this.isHyperbolic ? 'h' : ''}`;
            },
            class: 'math-button-secondary sm-text',
            onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
            get onTapArgs() {
              return [`${this.isInversed ? 'a' : ''}${func}${this.isHyperbolic ? 'h' : ''}`];
            }
          }
        }
      );
    }
    return commands;
  }

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.mathCommands = [
      ...this.numberCommands,
      ...this.trigonometricFunctionCommands,
      {
        shortcuts: ['x'],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['x'],
        button: {
          name: 'x',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['x']
        }
      },
      {
        shortcuts: ['.', ','],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['.'],
        button: {
          name: 'dot',
          displayName: '.',
          class: 'math-button-primary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['.']
        }
      },
      {
        shortcuts: ['Escape'],
        command: this.mathInput.resetCalculation.bind(this.mathInput),
        commandArgs: [],
        button: {
          name: 'C',
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          displayName: '*',
          class: 'math-button-secondary sm-text',
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
          displayName: '/',
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['!']
        }
      },
      {
        shortcuts: [],
        command: () => this.grid.isInversed = !this.grid.isInversed,
        button: {
          name: 'Inv',
          class: 'math-button-secondary sm-text',
          onTap: () => this.grid.isInversed = !this.grid.isInversed
        }
      },
      {
        shortcuts: [],
        command: () => this.grid.isInversed = !this.grid.isInversed,
        button: {
          name: 'Hyp',
          class: 'math-button-secondary sm-text',
          onTap: () => this.grid.isHyperbolic = !this.grid.isHyperbolic
        }
      },
      {
        shortcuts: [],
        command: this.mathInput.addSymbolToExpr.bind(this.mathInput),
        commandArgs: ['lb'],
        button: {
          name: 'lb',
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
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
          class: 'math-button-secondary sm-text',
          onTap: this.mathInput.addSymbolToExpr.bind(this.mathInput),
          onTapArgs: ['lg']
        }
      }
    ];
    const mathButtons = this.mathCommands.filter(command => command.button).map(command => command.button);
    this.grid.buttons = mathButtons;
    this.changeDetector.detectChanges();
  }

  toggleIsInversed() {
    this.grid.isInversed = !this.grid.isInversed;
  }
  toggleIsHyperbolic() {
    this.grid.isHyperbolic = !this.grid.isHyperbolic;
  }
}
