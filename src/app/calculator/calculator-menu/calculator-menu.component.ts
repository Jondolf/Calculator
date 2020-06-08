import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from '../../models/button.interface';

@Component({
  selector: 'app-calculator-menu',
  templateUrl: './calculator-menu.component.html',
  styleUrls: ['./calculator-menu.component.scss'],
})
export class CalculatorMenuComponent {
  @Output() changeCalculator = new EventEmitter();
  @Output() closeCalculatorMenu = new EventEmitter();

  calculatorMenuButtons: Button[] = [
    {
      buttonName: 'Basic calculator',
      icon: { iconName: 'functions' },
      styles: {}
    },
    {
      buttonName: 'Length converter',
      icon: { iconName: 'square_foot' },
      styles: {}
    },
  ];
}
