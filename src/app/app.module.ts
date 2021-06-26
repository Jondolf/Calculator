import { Injectable, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule, HammerGestureConfig, HammerModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HeaderColor } from '@ionic-native/header-color/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { Drivers } from '@ionic/storage';
import { IonicStorageModule } from '@ionic/storage-angular';
import * as Hammer from 'hammerjs';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalculatorMenuComponent } from './calculator/calculator-menu/calculator-menu.component';
// Calculator
import { CalculatorPage } from './calculator/calculators/calculator/calculator.page';
import { CustomizeButtonsModalComponent } from './calculator/calculators/calculator/customize-buttons-modal/customize-buttons-modal.component';
import { MoreCommandsMenuComponent } from './calculator/calculators/calculator/more-commands-menu/more-commands-menu.component';
import { MathModule } from './calculator/math-components/math.module';
// Settings
import { SettingsModalComponent } from './calculator/settings/settings-modal.component';
import { ThemesModalComponent } from './calculator/settings/themes/themes-modal.component';
import { OptionsPopoverComponent } from './calculator/top-bar/options-popover/options-popover.component';
import { TopBarComponent } from './calculator/top-bar/top-bar.component';
// Common
import { AccordionListModule } from './common/accordion-list/accordion-list.module';
import { StorageService } from './storage.service';

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
    SettingsModalComponent, ThemesModalComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({ scrollAssist: false }),
    IonicStorageModule.forRoot(
      {
        name: '_calculatordb',
        driverOrder: [Drivers.IndexedDB, Drivers.LocalStorage]
      }),
    AppRoutingModule,
    FormsModule,
    HammerModule,
    AccordionListModule,
    MathModule
  ],
  providers: [
    Keyboard,
    HeaderColor,
    StatusBar,
    SplashScreen,
    StorageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HAMMER_GESTURE_CONFIG, useClass: HammerConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
