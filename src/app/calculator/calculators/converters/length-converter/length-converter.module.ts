import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LengthConverterPageRoutingModule } from './length-converter-routing.module';

import { LengthConverterPage } from './length-converter.page';
import { AccordionListModule } from 'src/app/common/accordion-list/accordion-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LengthConverterPageRoutingModule,
    AccordionListModule
  ],
  declarations: [LengthConverterPage]
})
export class LengthConverterPageModule { }
