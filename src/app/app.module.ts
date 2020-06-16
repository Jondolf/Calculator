import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
import { SettingsMenuComponent } from './calculator/settings-menu/settings-menu.component';
import { ThemesComponent } from './calculator/settings-menu/themes/themes.component';
import { AboutComponent } from './calculator/settings-menu/about/about.component';
// basic calculator
import { BasicCalculatorComponent } from './calculator/calculators/basic-calculator/basic-calculator.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/basic-calculator/more-commands-menu/more-commands-menu.component';
import { CustomizeButtonsMenuComponent } from './calculator/calculators/basic-calculator/customize-buttons-menu/customize-buttons-menu.component';
// converters
import { LengthConverterComponent } from './calculator/calculators/converters/length-converter/length-converter.component';
import { MassConverterComponent } from './calculator/calculators/converters/mass-converter/mass-converter.component';
import { CurrencyConverterComponent } from './calculator/calculators/converters/currency-converter/currency-converter.component';
// common
import { FullscreenContainerComponent } from './common/fullscreen-container/fullscreen-container.component';
import { CircleButtonComponent } from './common/circle-button/circle-button.component';
import { WideButtonComponent } from './common/wide-button/wide-button.component';
import { AccordionListComponent } from './common/accordion-list/accordion-list.component';

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
  declarations: [AppComponent, TopBarComponent, OptionsPopoverComponent, CalculatorMenuComponent,
    BasicCalculatorComponent, CustomizeButtonsMenuComponent, MoreCommandsMenuComponent,
    LengthConverterComponent, MassConverterComponent, CurrencyConverterComponent,
    FullscreenContainerComponent, CircleButtonComponent, WideButtonComponent, AccordionListComponent,
    SettingsMenuComponent, ThemesComponent, AboutComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, FormsModule, HammerModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
