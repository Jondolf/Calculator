import { Component, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { GlobalVarsService } from './global-vars.service';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { filter } from 'rxjs/operators';

import Decimal from 'decimal.js';
Decimal.set({ precision: 25, rounding: 4 });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  @ViewChild('calculatormenu') calculatorMenu;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
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
