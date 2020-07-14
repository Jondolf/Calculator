import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TemperatureConverterPageRoutingModule } from './temperature-converter-routing.module';

import { TemperatureConverterPage } from './temperature-converter.page';
import { AccordionListModule } from 'src/app/common/accordion-list/accordion-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TemperatureConverterPageRoutingModule,
    AccordionListModule
  ],
  declarations: [TemperatureConverterPage]
})
export class TemperatureConverterPageModule { }
