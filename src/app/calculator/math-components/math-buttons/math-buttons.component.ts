import { Component, Input } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';

export type MathButton = {
  name?: string;
  displayName?: string;
  iconName?: string;
  class: string;
  onTap?: (...args: any) => any;
  onTapArgs?: Array<number | string>;
  onPress?: (...args: any) => any;
  onPressArgs?: Array<number | string>;
};
export type MathButtonGrid = {
  areas?: string;
  rows?: string;
  columns?: string;
  width?: number;
  height?: number;
  isInversed?: boolean;
  isHyperbolic?: boolean;
  buttons: MathButton[];
};

@Component({
  selector: 'app-math-buttons',
  templateUrl: './math-buttons.component.html',
  styleUrls: ['./math-buttons.component.scss']
})
export class MathButtonsComponent {
  @Input() grid: MathButtonGrid;
  @Input() gridStyles: CalculatorCustomStyles;

  constructor() { }

  onTap(btn: MathButton) {
    if (btn.onTapArgs) {
      btn.onTap(...btn.onTapArgs);
    } else {
      btn.onTap();
    }
  };

  onPress(btn: MathButton) {
    if (btn.onTapArgs) {
      btn.onPress(...btn.onPressArgs);
    } else {
      btn.onPress();
    }
  };
}
