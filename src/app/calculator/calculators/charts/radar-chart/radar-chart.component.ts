import { Component, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent {
  @Input() chartData: ChartDataSets[];
  @Input() chartLabels: Label[];
  @Input() chartColors: Color[];

  public chartOptions: ChartOptions = { responsive: true };
  public radarChartLegend = true;
  public radarChartType: ChartType = 'radar';
  public radarChartPlugins = [];
}
