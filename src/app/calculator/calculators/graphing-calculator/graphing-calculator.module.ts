import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Ng2PanZoomModule } from 'ng2-panzoom';

import { GraphingCalculatorPageRoutingModule } from './graphing-calculator-routing.module';

import { GraphingCalculatorPage } from './graphing-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Ng2PanZoomModule,
    GraphingCalculatorPageRoutingModule
  ],
  declarations: [GraphingCalculatorPage]
})
export class GraphingCalculatorPageModule { }
