import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Platform, ModalController } from '@ionic/angular';
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
      this.setTheme();
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.setStatusBarColors();
        this.screenOrientation.lock('portrait');
        this.splashScreen.hide();
      }
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
    if (this.platform.is('cordova') || this.platform.is('capacitor')) {
      if (document.body.className.includes('light')) {
        this.statusBar.backgroundColorByName('white');
        this.statusBar.styleDefault();
      } else {
        this.statusBar.backgroundColorByName('black');
        this.statusBar.styleLightContent();
      }
    }
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
