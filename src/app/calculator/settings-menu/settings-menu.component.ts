import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from 'src/app/models/button.interface';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {
  @Output() closeSettingsMenu = new EventEmitter();

  currentSettingsView = 'Settings menu';

  goBack() {
    if (this.currentSettingsView === 'Settings menu') {
      this.closeSettingsMenu.emit();
    } else {
      this.currentSettingsView = 'Settings menu';
    }
  }
}
