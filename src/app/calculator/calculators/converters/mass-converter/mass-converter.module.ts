import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MassConverterPageRoutingModule } from './mass-converter-routing.module';

import { MassConverterPage } from './mass-converter.page';
import { AccordionListModule } from 'src/app/common/accordion-list/accordion-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MassConverterPageRoutingModule,
    AccordionListModule
  ],
  declarations: [MassConverterPage]
})
export class MassConverterPageModule { }
