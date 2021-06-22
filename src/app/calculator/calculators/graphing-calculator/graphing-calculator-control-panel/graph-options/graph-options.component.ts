import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Graph, GraphStyle } from '../../graphs';

@Component({
  selector: 'graph-options',
  templateUrl: './graph-options.component.html',
  styleUrls: ['./graph-options.component.scss']
})
export class GraphOptionsComponent implements OnChanges {
  @Input() graph: Graph;
  @Output() close = new EventEmitter<void>();
  @Output() removeGraph = new EventEmitter<void>();
  @Output() changeGraphStyle = new EventEmitter<GraphStyle>();

  graphStyle: GraphStyle;
  colors = ['var(--ion-color-dark)', 'hsl(0, 100%, 50%)', 'hsl(60, 100%, 50%)', 'hsl(120, 100%, 50%)', 'hsl(180, 100%, 50%)', 'hsl(240, 100%, 50%)', 'hsl(300, 100%, 50%)'];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.graph.previousValue !== changes.graph.currentValue) {
      this.graphStyle = changes.graph.currentValue.style;
    }
  }
}
