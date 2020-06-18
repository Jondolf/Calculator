import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  currentCalculator: string;
  isBasicCalculatorButtonSettingsMenuOpen = false;
  isInSettings = false;

  changeCurrentCalculator(calculatorName: string): void {
    this.currentCalculator = calculatorName;
  }
}
