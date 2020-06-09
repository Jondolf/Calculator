import { Component } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-options-popover',
  templateUrl: './options-popover.component.html',
  styleUrls: ['./options-popover.component.scss'],
})
export class OptionsPopoverComponent {
  constructor(private popoverController: PopoverController, public globals: GlobalVarsService) {
  }

  emitMessage(message: string): void {
    this.popoverController.dismiss({ message });
  }
  closePopover(): void {
    this.popoverController.dismiss();
  }
}
