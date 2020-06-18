import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVarsService } from './global-vars.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import Decimal from 'decimal.js';
Decimal.set({ precision: 100, rounding: 4 });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ScreenOrientation]
})
export class AppComponent {
  @ViewChild('calculatormenu') calculatorMenu;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    public globals: GlobalVarsService,
    public router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Init app', new Date());
    this.platform.ready().then(() => {
      console.log('Platform ready', new Date());
      this.setStatusBarColors();
      this.screenOrientation.lock('portrait');
      this.splashScreen.hide();
    });
  }

  setStatusBarColors() {
    if (document.body.className.includes('light')) {
      this.statusBar.backgroundColorByName('white');
      this.statusBar.styleDefault();
    } else {
      this.statusBar.backgroundColorByName('black');
      this.statusBar.styleLightContent();
    }
  }
}
