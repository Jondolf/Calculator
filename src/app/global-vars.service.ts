import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  currentCalculator: string;
  currentTheme = 'light default light';
  currentThemeChange = new Subject<string>();

  isCalculatorMenuHidden = false;
  isCalculatorMenuHiddenChange = new Subject<boolean>();
  isCalculatorButtonSettingsMenuOpen = false;
  settingsView: '' | 'settings' | 'themes' = '';
}
