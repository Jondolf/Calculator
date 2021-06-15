import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AccordionListModule } from 'src/app/common/accordion-list/accordion-list.module';
import { CurrencyConverterPageRoutingModule } from './currency-converter-routing.module';
import { CurrencyConverterPage } from './currency-converter.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CurrencyConverterPageRoutingModule,
    AccordionListModule
  ],
  declarations: [
    CurrencyConverterPage
  ]
})
export class CurrencyConverterPageModule { }
