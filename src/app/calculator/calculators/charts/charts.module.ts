import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ChartsModule } from 'ng2-charts';
import { CommonComponentsModule } from 'src/app/common/common-components.module';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartsPageRoutingModule } from './charts-routing.module';
import { ChartsPage } from './charts.page';
import { LineChartComponent } from './line-chart/line-chart.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChartsModule,
    ChartsPageRoutingModule,
    CommonComponentsModule
  ],
  declarations: [ChartsPage, LineChartComponent, BarChartComponent, RadarChartComponent]
})
export class ChartsPageModule { }
