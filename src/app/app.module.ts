import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule, Injectable } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { BasicCalculatorComponent } from './calculator/basic-calculator/basic-calculator.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
import { FullscreenContainerComponent } from './common/fullscreen-container/fullscreen-container.component';
import { CircleButtonComponent } from './common/circle-button/circle-button.component';
import { WideButtonComponent } from './common/wide-button/wide-button.component';
import { SettingsMenuComponent } from './calculator/settings-menu/settings-menu.component';
import { ThemesComponent } from './calculator/settings-menu/themes/themes.component';
import { AboutComponent } from './calculator/settings-menu/about/about.component';
import { MoreCommandsMenuComponent } from './calculator/basic-calculator/more-commands-menu/more-commands-menu.component';

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
  declarations: [AppComponent, BasicCalculatorComponent, TopBarComponent, CalculatorMenuComponent,
    FullscreenContainerComponent, CircleButtonComponent, WideButtonComponent, SettingsMenuComponent,
    ThemesComponent, AboutComponent, MoreCommandsMenuComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HammerModule],
  providers: [{ provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }],
  bootstrap: [AppComponent],
})
export class AppModule { }
