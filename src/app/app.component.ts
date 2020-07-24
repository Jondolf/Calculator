import { Component } from '@angular/core';
import { Platform, ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Storage } from '@ionic/storage';
import Decimal from 'decimal.js';
import { GlobalVarsService } from './global-vars.service';
import { CalculatorMenuModalComponent } from './calculator/calculator-menu-modal/calculator-menu-modal.component';


Decimal.set({ precision: 100, rounding: 4 });

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: [ScreenOrientation]
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private headerColor: HeaderColor,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    public globals: GlobalVarsService,
    public router: Router,
    private storage: Storage,
    private modalCtrl: ModalController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    console.log('Init app', new Date());
    this.platform.ready().then(() => {
      console.log('Platform ready', new Date());
      this.setTheme().then(() => {
        if (this.platform.is('cordova') || this.platform.is('capacitor')) {
          this.statusBar.hide();
          this.setHeaderColor();
          this.screenOrientation.lock('portrait');
          this.splashScreen.hide();
        }
      }
      );
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
    } catch (error) {
      document.body.className = 'light default-light';
      this.globals.currentTheme = 'light default-light';
      throw new Error(error);
    }
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

  async presentCalculatorMenuModal() {
    const modal = await this.modalCtrl.create({
      component: CalculatorMenuModalComponent,
      cssClass: 'calculator-menu-modal'
    });
    await modal.present();
    this.globals.isCalculatorMenuOpen = true;
    this.globals.isCalculatorMenuOpenChange.next(this.globals.isCalculatorMenuOpen);
    return modal.onDidDismiss().then(
      (calculatorName: any) => {
        if (calculatorName && calculatorName.data) {
          const message: string = calculatorName.data.message;
          const route = '/' + message.toLowerCase().replace(/ /, '-');
          this.router.navigate([route]);
          this.globals.currentCalculator = message;
        }
        this.globals.isCalculatorMenuOpen = false;
        this.globals.isCalculatorMenuOpenChange.next(this.globals.isCalculatorMenuOpen);
      });
  }
}
