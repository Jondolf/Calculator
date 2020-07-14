import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from '../../models/button.interface';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-calculator-menu',
  templateUrl: './calculator-menu.component.html',
  styleUrls: ['./calculator-menu.component.scss'],
})
export class CalculatorMenuComponent {
  @Output() changeCalculator = new EventEmitter();
  @Output() closeCalculatorMenu = new EventEmitter();

  converters: Button[] = [
    {
      buttonName: 'Length converter',
      icon: {
        iconName: 'square_foot',
        iconPack: 'Material Design'
      }
    },
    {
      buttonName: 'Mass converter',
      icon: {
        iconName: 'barbell',
        iconPack: 'Ionicons'
      }
    },
    {
      buttonName: 'Temperature converter',
      icon: {
        iconName: 'thermometer-outline',
        iconPack: 'Ionicons'
      }
    },
    {
      buttonName: 'Currency converter',
      icon: {
        iconName: 'cash-outline',
        iconPack: 'Ionicons'
      }
    }
  ];

  constructor(private menu: MenuController) { }

  openFirst(): void {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }

  openEnd(): void {
    this.menu.open('end');
  }

  openCustom(): void {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
