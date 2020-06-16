import { Component, ViewChild } from '@angular/core';
import { GlobalVarsService } from './global-vars.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import Decimal from 'decimal.js';
Decimal.set({ precision: 25, rounding: 4 });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChild('calculatormenu') calculatorMenu;

  isSettingsMenuOpen: boolean;
  isBasicCalculatorButtonSettingsMenuOpen: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public globals: GlobalVarsService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
