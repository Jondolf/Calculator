import { Component, EventEmitter, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { StorageService } from 'src/app/storage.service';
import { CalculatorService } from '../calculator.service';

@Component({
  selector: 'app-customize-buttons-modal',
  templateUrl: './customize-buttons-modal.component.html',
  styleUrls: ['./customize-buttons-modal.component.scss'],
})
export class CustomizeButtonsModalComponent implements OnInit, OnChanges {
  @Output() close = new EventEmitter<void>();

  styles: CalculatorCustomStyles = {
    gridSize: 'small',
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

  constructor(
    public calculator: CalculatorService,
    public globals: GlobalVarsService,
    private storage: StorageService) { }

  ngOnInit() {
    this.styles = this.calculator.gridStyles;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentStyles.previousValue !== changes.currentStyles.currentValue) {
      this.styles = changes.currentStyles.currentValue;
    }
  }

  updateStyles(): void {
    this.calculator.gridStyles = this.styles;
    this.styles = this.calculator.gridStyles;
    this.storage.set('calculatorCustomStyles', this.calculator.gridStyles);
  }

  pixelsToNumber(pixelString: string): number {
    return +pixelString.slice(0, -2);
  }
}
