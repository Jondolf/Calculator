import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GraphingCalculatorPageRoutingModule } from './graphing-calculator-routing.module';

import { GraphingCalculatorPage } from './graphing-calculator.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphingCalculatorPageRoutingModule
  ],
  declarations: [GraphingCalculatorPage]
})
export class GraphingCalculatorPageModule {}
