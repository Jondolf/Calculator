import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { GraphOptionsComponent } from './graphing-calculator-control-panel/graph-options/graph-options.component';
import { GraphingCalculatorControlPanelComponent } from './graphing-calculator-control-panel/graphing-calculator-control-panel.component';
import { GraphingCalculatorPageRoutingModule } from './graphing-calculator-routing.module';
import { GraphingCalculatorPage } from './graphing-calculator.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphingCalculatorPageRoutingModule
  ],
  declarations: [GraphingCalculatorPage, GraphingCalculatorControlPanelComponent, GraphOptionsComponent]
})
export class GraphingCalculatorPageModule { }
