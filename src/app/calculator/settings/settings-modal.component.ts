import { Component } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { ModalController } from '@ionic/angular';
import { ThemesModalComponent } from './themes/themes-modal.component';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
  constructor(public globals: GlobalVarsService, private modalController: ModalController) { }

  dismissModal(message?): void {
    this.modalController.dismiss(message ? { message } : null);
  }

  async presentThemesModal() {
    const modal = await this.modalController.create({
      component: ThemesModalComponent,
      cssClass: 'themes-modal'
    });
    return await modal.present();
  }
}
