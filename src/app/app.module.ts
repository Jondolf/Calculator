import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
// Basic calculator
import { BasicCalculatorPage } from './calculator/calculators/basic-calculator/basic-calculator.page';
import { CustomizeButtonsModalComponent } from './calculator/calculators/basic-calculator/customize-buttons-modal/customize-buttons-modal.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/basic-calculator/more-commands-menu/more-commands-menu.component';
// common
import { FullscreenContainerComponent } from './common/fullscreen-container/fullscreen-container.component';
import { CircleButtonComponent } from './common/circle-button/circle-button.component';
import { WideButtonComponent } from './common/wide-button/wide-button.component';
import { AccordionListModule } from './common/accordion-list/accordion-list.module';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { OptionsPopoverComponent } from './calculator/top-bar/options-popover/options-popover.component';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    // Override default config
    swipe: { direction: Hammer.DIRECTION_ALL },
    press: { time: 1500 }
  };
}

@NgModule({
  declarations: [
    AppComponent, TopBarComponent, OptionsPopoverComponent, CalculatorMenuComponent,
    BasicCalculatorPage, CustomizeButtonsModalComponent, MoreCommandsMenuComponent,
    FullscreenContainerComponent, CircleButtonComponent, WideButtonComponent
  ],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), IonicStorageModule.forRoot(),
    AppRoutingModule, FormsModule, HammerModule, AccordionListModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
