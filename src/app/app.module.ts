import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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

@NgModule({
  declarations: [AppComponent, BasicCalculatorComponent, TopBarComponent, CalculatorMenuComponent,
    FullscreenContainerComponent, CircleButtonComponent, WideButtonComponent, SettingsMenuComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
