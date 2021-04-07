import { Component, Input } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';

type MathButton = {
  name?: string;
  displayName?: string;
  iconName?: string;
  class: string;
  onTap?: (arg1?: any, arg2?: any) => any;
  onTapArgs?: Array<number | string>;
  onPress?: (arg1?: any, arg2?: any) => any;
  onPressArgs?: Array<number | string>;
};
export type MathButtonGrid = {
  gridAreas?: string;
  rows?: string;
  columns?: string;
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
