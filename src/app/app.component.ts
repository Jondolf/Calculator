import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import Decimal from 'decimal.js';
import { GlobalVarsService } from './global-vars.service';


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
    public router: Router,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Init app', new Date());
    this.platform.ready().then(() => {
      console.log('Platform ready', new Date());
      this.setTheme();
      this.setStatusBarColors();
      this.screenOrientation.lock('portrait');
      this.splashScreen.hide();
    });
  }

  async setTheme(): Promise<void> {
    try {
      const theme: string = await this.storage.get('theme');
      if (theme) {
        document.body.className = theme;
        this.globals.currentTheme = theme;
      } else {
        document.body.className = 'light default-light';
        this.globals.currentTheme = 'light default-light';
      }
      this.globals.currentThemeChange.next(this.globals.currentTheme);
      this.setStatusBarColors();
    } catch (error) {
      document.body.className = 'light default-light';
      this.globals.currentTheme = 'light default-light';
      this.setStatusBarColors();
      throw new Error(error);
    }
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
