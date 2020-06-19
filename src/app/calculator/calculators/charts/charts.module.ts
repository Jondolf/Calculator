import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChartsModule } from 'ng2-charts';

import { ChartsPageRoutingModule } from './charts-routing.module';

import { ChartsPage } from './charts.page';
import { LineChartComponent } from './line-chart/line-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    ChartsPageRoutingModule
  ],
  declarations: [ChartsPage, LineChartComponent, BarChartComponent]
})
export class ChartsPageModule { }
