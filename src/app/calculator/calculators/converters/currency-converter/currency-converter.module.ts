import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { CurrencyConverterPageRoutingModule } from './currency-converter-routing.module';
import { CurrencyConverterPage } from './currency-converter.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyConverterPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [
    CurrencyConverterPage
  ]
})
export class CurrencyConverterPageModule { }
