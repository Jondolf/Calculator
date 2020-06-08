import { NgModule, Injectable } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { BasicCalculatorComponent } from './calculator/calculators/basic-calculator/basic-calculator.component';
import { LengthConverterComponent } from './calculator/calculators/length-converter/length-converter.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
import { FullscreenContainerComponent } from './common/fullscreen-container/fullscreen-container.component';
import { CircleButtonComponent } from './common/circle-button/circle-button.component';
import { WideButtonComponent } from './common/wide-button/wide-button.component';
import { SettingsMenuComponent } from './calculator/settings-menu/settings-menu.component';
import { ThemesComponent } from './calculator/settings-menu/themes/themes.component';
import { AboutComponent } from './calculator/settings-menu/about/about.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/basic-calculator/more-commands-menu/more-commands-menu.component';

import * as Hammer from 'hammerjs';
import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

@Injectable()
export class HammerConfig extends HammerGestureConfig {
  overrides = {
    // Override default config
    swipe: { direction: Hammer.DIRECTION_ALL }
  };
}

@NgModule({
  declarations: [AppComponent, BasicCalculatorComponent, LengthConverterComponent, TopBarComponent, CalculatorMenuComponent,
    FullscreenContainerComponent, CircleButtonComponent, WideButtonComponent, SettingsMenuComponent,
    ThemesComponent, AboutComponent, MoreCommandsMenuComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HammerModule],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
