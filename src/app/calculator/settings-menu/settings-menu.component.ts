import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from 'src/app/models/button.interface';

@Component({
  selector: 'app-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss']
})
export class SettingsMenuComponent {
  @Output() closeSettingsMenu = new EventEmitter();

  settingsMenuButtons: Button[] = [
    {
      buttonName: 'Default light',
      icon: {},
      styles: {}
    },
    {
      buttonName: 'Default dark',
      icon: {},
      styles: {}
    },
    {
      buttonName: 'Solarized light',
      icon: {},
      styles: {}
    },
    {
      buttonName: 'Solarized dark',
      icon: {},
      styles: {}
    }
  ];
  themes: string[] = ['light default-light', 'dark default-dark', 'light solarized-light', 'dark solarized-dark'];

  changeTheme(theme: string) {
    document.body.className = theme;
  }
}
