import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { MathModule } from '../../math-components/math.module';
import { GraphKeyboardComponent } from './graphing-calculator-control-panel/graph-keyboard/graph-keyboard.component';
import { GraphOptionsComponent } from './graphing-calculator-control-panel/graph-options/graph-options.component';
import { GraphingCalculatorControlPanelComponent } from './graphing-calculator-control-panel/graphing-calculator-control-panel.component';
import { GraphingCalculatorPageRoutingModule } from './graphing-calculator-routing.module';
import { GraphingCalculatorPage } from './graphing-calculator.page';




@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GraphingCalculatorPageRoutingModule,
    CommonComponentsModule,
    MathModule
  ],
  declarations: [GraphingCalculatorPage, GraphingCalculatorControlPanelComponent, GraphOptionsComponent, GraphKeyboardComponent]
})
export class GraphingCalculatorPageModule { }
