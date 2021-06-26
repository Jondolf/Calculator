import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { MathButtonGrid } from '../../../math-components/math-buttons/math-buttons.component';

@Component({
  selector: 'app-more-commands-menu',
  templateUrl: './more-commands-menu.component.html',
  styleUrls: ['./more-commands-menu.component.scss']
})
export class MoreCommandsMenuComponent implements AfterViewInit {
  @Input() gridSize: string;
  @Input() addSymbolToExpr: (symbol: string) => void;

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

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.mediumMathBtnGrid = {
      width: 4,
      buttons: [
        {
          name: 'opening-parenthesis',
          displayName: '(',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['('],
        },
        {
          name: 'closing-parenthesis',
          displayName: ')',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: [')'],
        },
        {
          name: 'mod',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['mod'],
        },
        {
          name: 'percent',
          displayName: 'n%',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['%'],
        },
        {
          name: 'factorial',
          displayName: 'n!',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['!'],
        },
        {
          name: 'sin',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['sin'],
        },
        {
          name: 'cos',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['cos'],
        },
        {
          name: 'tan',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['tan'],
        },
        {
          name: 'lb',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['lb'],
        },
        {
          name: 'ln',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['ln'],
        },
        {
          name: 'lg',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['lg'],
        }
      ]
    };
    this.smallMathBtnGrid = {
      width: 4,
      buttons: [
        {
          name: 'sqrt',
          displayName: '√',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['√'],
        },
        {
          name: 'pow',
          displayName: '^',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['^'],
        },
        {
          name: 'pi',
          displayName: 'π',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['π'],
        },
        {
          name: 'e',
          class: 'math-button-tertiary lg-text',
          onTap: this.addSymbolToExpr,
          onTapArgs: ['e'],
        },
        ...this.mediumMathBtnGrid.buttons
      ]
    };
    this.changeDetector.detectChanges();
  }
}
