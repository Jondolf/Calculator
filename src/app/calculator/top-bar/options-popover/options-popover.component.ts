import { Component } from '@angular/core';
import { PopoverController, ModalController } from '@ionic/angular';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { BasicCalculatorService } from '../../calculators/basic-calculator/basic-calculator.service';

import { CustomizeButtonsModalComponent } from '../../calculators/basic-calculator/customize-buttons-modal/customize-buttons-modal.component';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
})
export class OptionsPopoverComponent {
  constructor(
    private popoverController: PopoverController,
    private modalController: ModalController,
    public globals: GlobalVarsService,
    public basicCalculator: BasicCalculatorService
  ) { }

  emitMessage(message: string): void {
    this.popoverController.dismiss({ message });
  }
  closePopover(): void {
    this.popoverController.dismiss();
  }

  async presentCustomizeBasicCalculatorButtonsModal() {
    const modal = await this.modalController.create({
      component: CustomizeButtonsModalComponent,
      cssClass: 'basic-calculator-customize-buttons-modal'
    });
    return await modal.present();
  }
}
