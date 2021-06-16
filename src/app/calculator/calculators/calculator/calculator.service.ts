import { Injectable } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { StorageService } from 'src/app/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CalculatorService {
  isCalculatorButtonSettingsMenuOpen: boolean;
  gridStyles = this.getDefaultStyles();

  constructor(private storage: StorageService) {
    this.storage.get('calculatorCustomStyles').then(val => {
      if (val) {
        this.gridStyles = val;
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
