import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage';
import * as Hammer from 'hammerjs';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
// Calculator
import { CalculatorPage } from './calculator/calculators/calculator/calculator.page';
import { CustomizeButtonsModalComponent } from './calculator/calculators/calculator/customize-buttons-modal/customize-buttons-modal.component';
import { MathButtonsComponent } from './calculator/calculators/calculator/math-buttons/math-buttons.component';
import { MathInputComponent } from './calculator/calculators/calculator/math-input/math-input.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/calculator/more-commands-menu/more-commands-menu.component';
// Settings
import { SettingsModalComponent } from './calculator/settings/settings-modal.component';
import { ThemesModalComponent } from './calculator/settings/themes/themes-modal.component';
import { OptionsPopoverComponent } from './calculator/top-bar/options-popover/options-popover.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
// Common
import { AccordionListModule } from './common/accordion-list/accordion-list.module';



@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    // Override default config
    swipe: { direction: Hammer.DIRECTION_ALL },
    pan: { enable: false, threshold: 0 },
    pinch: { enable: true },
    press: { time: 1500, threshold: 100 },
    tap: { time: 4000, threshold: 100, direction: Hammer.DIRECTION_ALL }
  };
}

@NgModule({
  declarations: [
    AppComponent, TopBarComponent, OptionsPopoverComponent, CalculatorMenuComponent,
    CalculatorPage, CustomizeButtonsModalComponent, MoreCommandsMenuComponent,
    SettingsModalComponent, ThemesModalComponent,
    MathInputComponent, MathButtonsComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ scrollAssist: false }),
    IonicStorageModule.forRoot(
      {
        name: '_calculatordb',
        driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage']
      }),
    AppRoutingModule,
    FormsModule,
    HammerModule,
    AccordionListModule,
  ],
  providers: [
    Keyboard,
    HeaderColor,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
