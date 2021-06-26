import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Graph, GraphStyle, GraphType } from '../graphs';

@Component({
  selector: 'graphing-calculator-control-panel',
  templateUrl: './graphing-calculator-control-panel.component.html',
  styleUrls: ['./graphing-calculator-control-panel.component.scss']
})
export class GraphingCalculatorControlPanelComponent {
  @Input() graphs: Graph[];
  @Input() evalExpr: () => number | string;
  @Output() addGraph = new EventEmitter<GraphType>();
  @Output() removeGraph = new EventEmitter<number>();
  @Output() equationChange = new EventEmitter<{ graphIndex: number; value: string; }>();
  @Output() changeGraphStyle = new EventEmitter<GraphStyle>();

  isGraphOptionsOpen = false;
  isEditingEquation = false;
  focusedGraph: Graph;
  focusedGraphIndex: number;

  constructor() { }

  setFocusedGraph(graph: Graph, index: number) {
    this.focusedGraph = graph;
    this.focusedGraphIndex = index;
  }
}
