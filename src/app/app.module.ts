import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { AppComponent } from './app.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
import { OptionsPopoverComponent } from './calculator/top-bar/options-popover/options-popover.component';
import { CalculatorMenuModalComponent } from './calculator/calculator-menu-modal/calculator-menu-modal.component';
// Settings
import { SettingsModalComponent } from './calculator/settings/settings-modal.component';
import { ThemesModalComponent } from './calculator/settings/themes/themes-modal.component';
// Calculator
import { CalculatorPage } from './calculator/calculators/calculator/calculator.page';
import { CustomizeButtonsModalComponent } from './calculator/calculators/calculator/customize-buttons-modal/customize-buttons-modal.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/calculator/more-commands-menu/more-commands-menu.component';
// Common
import { AccordionListModule } from './common/accordion-list/accordion-list.module';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
    AppComponent, TopBarComponent, OptionsPopoverComponent, CalculatorMenuModalComponent,
    CalculatorPage, CustomizeButtonsModalComponent, MoreCommandsMenuComponent,
    SettingsModalComponent, ThemesModalComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(
    { name: '_calculatordb', driverOrder: ['indexeddb', 'sqlite', 'websql', 'localstorage'] }),
    AppRoutingModule, FormsModule, HammerModule, AccordionListModule],
  providers: [
    StatusBar,
    HeaderColor,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
