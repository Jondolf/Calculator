import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CalculatorCustomStyles } from 'src/app/models/calculator-custom-styles.interface';
import { ModalController } from '@ionic/angular';
import { CalculatorService } from '../calculator.service';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-customize-buttons-modal',
  templateUrl: './customize-buttons-modal.component.html',
  styleUrls: ['./customize-buttons-modal.component.scss'],
})
export class CustomizeButtonsModalComponent implements OnInit, OnChanges {
  styles: CalculatorCustomStyles = {
    gridSize: 'small',
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

  constructor(
    public modalController: ModalController,
    public calculator: CalculatorService,
    private storage: Storage) {

  }

  ngOnInit() {
    this.styles = this.calculator.buttonStyles;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentStyles.previousValue !== changes.currentStyles.currentValue) {
      this.styles = changes.currentStyles.currentValue;
    }
  }

  dismissModal(message?): void {
    this.modalController.dismiss(message ? { message } : null);
  }

  updateStyles(): void {
    this.calculator.buttonStyles = this.styles;
    this.styles = this.calculator.buttonStyles;
    this.storage.set('calculatorCustomStyles', this.calculator.buttonStyles);
  }

  pixelsToNumber(pixelString: string): number {
    return +pixelString.slice(0, -2);
  }
}
