import { Component } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { CalculatorService } from '../../calculators/calculator/calculator.service';
import { CustomizeButtonsModalComponent } from '../../calculators/calculator/customize-buttons-modal/customize-buttons-modal.component';


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
    public calculator: CalculatorService
  ) { }

  emitMessage(message: string): void {
    this.popoverController.dismiss({ message });
  }
  closePopover(): void {
    this.popoverController.dismiss();
  }

  async presentCustomizeCalculatorButtonsModal() {
    const modal = await this.modalController.create({
      component: CustomizeButtonsModalComponent,
      cssClass: 'calculator-customize-buttons-modal'
    });
    return await modal.present();
  }
}
