import { Component, EventEmitter, Output } from '@angular/core';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Button } from 'src/app/models/button.interface';
import { StorageService } from 'src/app/storage.service';

@Component({
  selector: 'app-themes-modal',
  templateUrl: './themes-modal.component.html',
  styleUrls: ['./themes-modal.component.scss']
})
export class ThemesModalComponent {
  @Output() closeThemesMenu = new EventEmitter();

  lightThemes: Button[] = [
    {
      buttonName: 'Default light',
      icon: {},
      styles: {
        backgroundRgb: '245, 245, 245',
        backgroundAlpha: '1',
        fontColor: '#000000',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Solarized light',
      icon: {},
      styles: {
        backgroundRgb: '238,232,213',
        backgroundAlpha: '1',
        fontColor: '#435156',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Pure white',
      icon: {},
      styles: {
        backgroundRgb: '255, 255, 255',
        backgroundAlpha: '1',
        fontColor: '#1e1e1e'
      }
    }
  ];
  darkThemes: Button[] = [
    {
      buttonName: 'Default dark',
      icon: {},
      styles: {
        backgroundRgb: '57, 62, 70',
        backgroundAlpha: '1',
        fontColor: '#ffffff',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Solarized dark',
      icon: {},
      styles: {
        backgroundRgb: '7, 54, 66',
        backgroundAlpha: '1',
        fontColor: '#acb7b9',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Palenight',
      icon: {},
      styles: {
        backgroundRgb: '41, 45, 62',
        backgroundAlpha: '1',
        fontColor: '#a6accd',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Pure black',
      icon: {},
      styles: {
        backgroundRgb: '0, 0, 0',
        backgroundAlpha: '1',
        fontColor: '#e1e1e1',
        margin: '0 0 10px 0'
      }
    }];
  lighThemeClasses: string[] = ['light default-light', 'light solarized-light', 'light pure-white'];
  darkThemeClasses: string[] = ['dark default-dark', 'dark solarized-dark', 'dark palenight', 'dark pure-black'];

  constructor(
    public globals: GlobalVarsService,
    private platform: Platform,
    private headerColor: HeaderColor,
    private storage: StorageService,
    private modalController: ModalController) { }

  changeTheme(themeClassName: string) {
    document.body.className = themeClassName;
    this.globals.currentTheme = themeClassName;
    this.storage.set('theme', this.globals.currentTheme);
    this.globals.currentThemeChange.next(this.globals.currentTheme);
    this.setHeaderColor();
  }

  // The "multitasking view" app header on Android
  setHeaderColor() {
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      // At least on my phone if the header color is pure white or pure black, it doesn't work
      if (document.body.className.includes('pure-white')) {
        this.headerColor.tint('#fefefe');
      } else if (document.body.className.includes('pure-black')) {
        this.headerColor.tint('#010101');
      } else {
        this.headerColor.tint(this.getCSSVar('--ion-color-primary'));
      }
    }
  }

  getCSSVar(varName: string): string {
    return getComputedStyle(document.body).getPropertyValue(varName);
  }

  dismissModal(message?): void {
    this.modalController.dismiss(message ? { message } : null);
  }
}
