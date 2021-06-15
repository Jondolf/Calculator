import { Component, ElementRef, ViewChild } from '@angular/core';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
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
  @ViewChild('routeroutlet', { read: ElementRef }) routerOutletRef;

  keyboardHeight = '0px';

  constructor(
    public globals: GlobalVarsService,
    private platform: Platform,
    private keyboard: Keyboard,
    private splashScreen: SplashScreen,
    private headerColor: HeaderColor,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setTheme().then(() => {
        if (this.platform.is('cordova') || this.platform.is('capacitor')) {
          this.statusBar.hide();
          this.setHeaderColor();
          this.screenOrientation.lock('portrait');
          this.splashScreen.hide();
          this.keyboard.disableScroll(false);
          this.listenForKeyboardEventsAndSetContentOffset();
        }
      }
      );
    }).catch(error => console.error(error));
  }

  /*
  Ionic didn't push up content when keyboard was open (which hid content) and I couldn't find a way to fix it, so I implemented it manually.
  I tried to set the bottom offset by binding the style to the element, like: [style.bottom]="keyboardHeight" but the UI wasn't updating
  until I started typing, so I explicitly set the offset here.
  */
  listenForKeyboardEventsAndSetContentOffset(): void {
    const routerOutletElement: HTMLElement = this.routerOutletRef.nativeElement;
    window.addEventListener('keyboardWillShow', (e: any) => {
      this.keyboardHeight = e.keyboardHeight + 'px'; routerOutletElement.style.bottom = this.keyboardHeight;
    });
    window.addEventListener('keyboardWillHide', () => {
      this.keyboardHeight = '0px'; routerOutletElement.style.bottom = this.keyboardHeight;
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
  setHeaderColor(): void {
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
}
