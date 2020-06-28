import { Component, OnInit, OnDestroy } from '@angular/core';
import { Chart, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-charts',
  templateUrl: './charts.page.html',
  styleUrls: ['./charts.page.scss'],
})
export class ChartsPage implements OnInit, OnDestroy {
  currentChartName = 'Line chart';
  colors = [
    '150, 150, 255',
    '255, 150, 150',
    '150, 255, 150'
  ];
  chartDataSets: ChartDataSets[] = [
    {
      data: [0, 3, 1],
      label: 'Series A',
      backgroundColor: `rgba(${this.colors[0]}, 0.5)`,
      borderColor: `rgb(${this.colors[0]})`,
      pointBackgroundColor: `rgb(${this.colors[0]})`,
      pointBorderColor: `rgb(${this.colors[0]})`
    },
    {
      data: [1, 0, 2],
      label: 'Series B',
      backgroundColor: `rgba(${this.colors[1]}, 0.5)`,
      borderColor: `rgb(${this.colors[1]})`,
      pointBackgroundColor: `rgb(${this.colors[1]})`,
      pointBorderColor: `rgb(${this.colors[1]})`
    }
  ];
  chartLabels: Label[] = ['1', '2', '3'];

  constructor(private globals: GlobalVarsService) { }

  ngOnInit(): void {
    this.globals.currentThemeChange.subscribe((value) => {
      if (value.includes('light')) {
        Chart.defaults.global.defaultFontColor = 'black';
      } else {
        Chart.defaults.global.defaultFontColor = 'white';
      }
      this.updateChart();
    });

    if (this.globals.currentTheme.includes('light')) {
      Chart.defaults.global.defaultFontColor = 'black';
    } else {
      Chart.defaults.global.defaultFontColor = 'white';
    }
    Chart.defaults.global.defaultFontFamily = 'Nunito Sans';
  }
  ngOnDestroy(): void {
    this.globals.currentThemeChange.unsubscribe();
  }

  getNewColor(): string {
    if (this.chartDataSets.length < this.colors.length) {
      return this.colors[this.chartDataSets.length];
    } else {
      this.colors.push(this.generateRandomRgb(100));
      return this.colors[this.chartDataSets.length];
    }
  }

  generateRandomRgb(darkestPossibleValue: number) {
    const r = Math.random() * (255 - darkestPossibleValue) + darkestPossibleValue;
    const g = Math.random() * (255 - darkestPossibleValue) + darkestPossibleValue;
    const b = Math.random() * (255 - darkestPossibleValue) + darkestPossibleValue;
    return `${r}, ${g}, ${b}`;
  }

  addChartDataSet() {
    const color = this.getNewColor();
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // When characters run out, use AA, AB, AC... Doesn't work with othe character combinations like BA, BB...
    const character = alphabet[this.chartDataSets.length]
      ? alphabet[this.chartDataSets.length]
      : alphabet[0] + alphabet[this.chartDataSets.length - alphabet.length];

    this.chartDataSets.push(
      {
        data: [0, 0, 0],
        label: 'Series ' + character,
        backgroundColor: `rgba(${color}, 0.5)`,
        borderColor: `rgb(${color})`,
        pointBackgroundColor: `rgb(${color})`,
        pointBorderColor: `rgb(${color})`
      });
  }

  removeDataSet(dataSet: ChartDataSets) {
    const indexOfDataSet = this.chartDataSets.indexOf(dataSet);
    this.chartDataSets.splice(indexOfDataSet, 1);
  }

  handleDataInputChange(chartData: ChartDataSets, event: KeyboardEvent, target: HTMLInputElement): void {
    const isBackspaceEvent = event.key === null ? true : false;
    target.value = isBackspaceEvent ? target.value : target.value.toString().replace(/[^0-9.,]/g, '');
    this.parseChartDataStringToArray(
      chartData,
      isBackspaceEvent ? target.value.toString() : target.value.toString().replace(/[^0-9.,]/g, '')
    );
    this.updateChartLabels();
    this.updateChart();
  }

  handleDataLabelInputChange(chartData: ChartDataSets, str: string): void {
    chartData.label = str;
    this.updateChart();
  }

  /**
   * Triggers the chart update by setting the data to data.slice(), which doesn't actually change the values but triggers the change.
   */
  updateChart() {
    this.chartDataSets = this.chartDataSets.slice();
  }

  handleChartTypeChange(chartName: string) {
    switch (chartName) {
      case 'Line chart':
        this.currentChartName = 'Line chart';
        break;
      case 'Bar chart':
        this.currentChartName = 'Bar chart';
        break;
      case 'Radar chart':
        this.currentChartName = 'Radar chart';
        break;
      default:
        this.currentChartName = 'Line chart';
    }
  }

  parseChartDataStringToArray(chartData: ChartDataSets, str: string): void {
    chartData.data = str.split(',').map((dataString: string) => +dataString);
  }

  updateChartLabels(): void {
    const chartLabelArray: string[] = [];
    const biggestChartDataLength = this.getBiggestChartDataLength();
    for (let i = 0; i < biggestChartDataLength; i++) {
      chartLabelArray.push((i + 1).toString());
    }
    this.chartLabels = chartLabelArray;
  }

  getBiggestChartDataLength(): number {
    const chartDataSetLengths: number[] = [];
    for (const dataSet of this.chartDataSets) {
      chartDataSetLengths.push(dataSet.data.length);
    }
    return Math.max(...chartDataSetLengths);
  }
}
