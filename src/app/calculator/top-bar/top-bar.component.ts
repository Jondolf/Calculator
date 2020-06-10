import { Component, Output, EventEmitter, ViewChild } from '@angular/core';
import { PopoverController, Animation, AnimationBuilder } from '@ionic/angular';
import { OptionsPopoverComponent } from './options-popover/options-popover.component';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  @Output() openCalculatorMenu = new EventEmitter();
  @Output() openSettingsMenu = new EventEmitter();

  constructor(public popoverController: PopoverController) { }

  async presentPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: OptionsPopoverComponent,
      cssClass: 'options-popover',
      event: ev,
      translucent: true,
      animated: false
    });
    popover.present();
    return popover.onDidDismiss().then(
      (data: any) => {
        if (!data || !data.data) { return; }
        const message = data.data.message;
        if (message === 'openSettingsMenu') {
          this.openSettingsMenu.emit();
        }
      });
  }
}
