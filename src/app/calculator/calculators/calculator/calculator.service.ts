import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  isCalculatorButtonSettingsMenuOpen: boolean;
  buttonStyles = this.getDefaultStyles();

  constructor(private storage: Storage) {
    this.storage.get('calculatorCustomStyles').then(val => {
      if (val) {
        this.buttonStyles = val;
      }
    });
  }

  getDefaultStyles() {
    return {
      gridSize: 'small',
      gridGap: '0px',
      buttonStyles: {
        'border-radius': '0px',
        'border-width': '1px'
      }
    } as CalculatorCustomStyles;
  }
}
