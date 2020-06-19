import { Component, Input, ViewChild } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent {
  @Input() chartData: ChartDataSets[];
  @Input() chartLabels: Label[];
  @Input() chartColors: Color[];
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;

  public chartOptions: ChartOptions = {};
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  updateData() {
    this.chart.update();
  }
}
