import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  currentCalculator: string;
  currentTheme = 'light default light';
  currentThemeChange = new Subject<string>();

  isCalculatorMenuOpen = false;
  isCalculatorMenuOpenChange = new Subject<boolean>();
  isCalculatorButtonSettingsMenuOpen = false;
  isInSettings = false;

  changeCurrentCalculator(calculatorName: string): void {
    this.currentCalculator = calculatorName;
  }
}
