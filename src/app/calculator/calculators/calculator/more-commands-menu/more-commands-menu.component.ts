import { AfterViewInit, Component, Input } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { MathButtonGrid } from '../math-buttons/math-buttons.component';

@Component({
  selector: 'app-more-commands-menu',
  templateUrl: './more-commands-menu.component.html',
  styleUrls: ['./more-commands-menu.component.scss']
})
export class MoreCommandsMenuComponent implements AfterViewInit {
  @Input() gridSize: string;
  @Input() addSymbolToCalculation: (symbol: string) => void;

  menuOpen = false;
  smallMathBtnGrid: MathButtonGrid;
  mediumMathBtnGrid: MathButtonGrid;

  gridStyles: CalculatorCustomStyles = {
    gridSize: 'small', // Actual grid size gotten as input
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

  ngAfterViewInit() {
    this.mediumMathBtnGrid = {
      columns: '1fr 1fr 1fr 1fr',
      buttons: [
        {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: [')'],
        },
        {
          name: 'mod',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['mod'],
        },
        {
          name: 'percent',
          displayName: 'n%',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['%'],
        },
        {
          name: 'factorial',
          displayName: 'n!',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['!'],
        },
        {
          name: 'sin',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['sin'],
        },
        {
          name: 'cos',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['cos'],
        },
        {
          name: 'tan',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['tan'],
        },
        {
          name: 'lb',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['lb'],
        },
        {
          name: 'ln',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['ln'],
        },
        {
          name: 'lg',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['lg'],
        }
      ]
    };
    this.smallMathBtnGrid = {
      columns: '1fr 1fr 1fr 1fr',
      buttons: [
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToCalculation,
          onTapArgs: ['e'],
        },
        ...this.mediumMathBtnGrid.buttons
      ]
    };
  }
}
