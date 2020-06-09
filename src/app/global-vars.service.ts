import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVarsService {
  currentCalculator = 'Basic calculator';

  changeCurrentCalculator(calculatorName: string): void {
    this.currentCalculator = calculatorName;
  }
}
