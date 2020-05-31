import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  currentCalculator = 'Basic calculator';
  isCalculatorMenuOpen: boolean;
  isSettingsMenuOpen: boolean;
}
