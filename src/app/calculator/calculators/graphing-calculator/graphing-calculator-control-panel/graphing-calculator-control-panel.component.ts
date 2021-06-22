import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Graph, GraphStyle, GraphType } from '../graphs';

@Component({
  selector: 'graphing-calculator-control-panel',
  templateUrl: './graphing-calculator-control-panel.component.html',
  styleUrls: ['./graphing-calculator-control-panel.component.scss']
})
export class GraphingCalculatorControlPanelComponent {
  @Input() graphs: Graph[];
  @Output() addGraph = new EventEmitter<GraphType>();
  @Output() removeGraph = new EventEmitter<number>();
  @Output() changeGraphStyle = new EventEmitter<GraphStyle>();

  isGraphOptionsOpen = false;
  focusedGraph: Graph;
  focusedGraphIndex: number;

  constructor() { }

  openGraphOptions(graph: Graph, i: number) {
    this.isGraphOptionsOpen = true;
    this.focusedGraph = graph;
    this.focusedGraphIndex = i;
  }
}
