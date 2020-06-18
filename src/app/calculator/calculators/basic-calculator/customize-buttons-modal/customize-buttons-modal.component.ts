import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BasicCalculatorCustomStyles } from 'src/app/models/basic-calculator-custom-styles.interface';
import { ModalController } from '@ionic/angular';
import { BasicCalculatorService } from '../basic-calculator.service';

@Component({
  selector: 'app-customize-buttons-modal',
  templateUrl: './customize-buttons-modal.component.html',
  styleUrls: ['./customize-buttons-modal.component.scss'],
})
export class CustomizeButtonsModalComponent implements OnInit, OnChanges {
  styles: BasicCalculatorCustomStyles = {
    gridSize: 'small',
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

  constructor(public modalController: ModalController, public basicCalculator: BasicCalculatorService) {

  }

  ngOnInit() {
    this.styles = this.basicCalculator.buttonStyles;
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
    this.basicCalculator.buttonStyles = this.styles;
    this.styles = this.basicCalculator.buttonStyles;
  }

  pixelsToNumber(pixelString: string): number {
    return +pixelString.slice(0, -2);
  }
}
