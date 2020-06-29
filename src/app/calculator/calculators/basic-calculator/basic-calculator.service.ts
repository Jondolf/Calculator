import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BasicCalculatorCustomStyles } from 'src/app/models/basic-calculator-custom-styles.interface';

@Injectable({
  providedIn: 'root'
})
export class BasicCalculatorService {
  isBasicCalculatorButtonSettingsMenuOpen: boolean;
  buttonStyles = this.getDefaultStyles();

  constructor(private storage: Storage) {
    this.storage.get('basicCalculatorCustomStyles').then(val => {
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
    } as BasicCalculatorCustomStyles;
  }
}
