import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { OptionsPopoverComponent } from './options-popover/options-popover.component';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent {
  @Output() openCalculatorMenu = new EventEmitter();

  constructor(public popoverController: PopoverController, public globals: GlobalVarsService, public router: Router) { }

  async presentPopover(ev: Event) {
    const popover = await this.popoverController.create({
      component: OptionsPopoverComponent,
      cssClass: 'options-popover',
      event: ev,
      translucent: true,
      animated: true
    });
    popover.present();
    return popover.onDidDismiss().then(
      (data: any) => {
        if (!data || !data.data) { return; }
        const message = data.data.message;
      });
  }

  getCalculatorNameFromRoute() {
    if (this.router.url === '/') {
      return 'Calculator';
    }
    // Replace slashes and hyphens
    let calculatorName = this.router.url.replace('/', '').replace(/-/g, ' ');
    // Make first letter uppercased
    calculatorName = calculatorName.charAt(0).toUpperCase() + calculatorName.slice(1);
    return calculatorName;
  }
}
