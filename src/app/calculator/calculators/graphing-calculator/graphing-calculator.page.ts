import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { Gesture, GestureController } from '@ionic/angular';
import ResizeObserverPolyfill from 'resize-observer-polyfill'; // Normal resize observer gave errors
import { MathEvaluatorService } from '../../math-evaluator/math-evaluator.service';
import { GraphCoordinate, SvgCoordinate } from './coordinates';
import { GraphController } from './graph-controller';
import { Graph, GraphType, Line, Point } from './graphs';

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements AfterViewInit, OnDestroy {
  @ViewChild('svg') svgRef: ElementRef;
  @ViewChild('svgcontainer') svgContainerRef: ElementRef;
  svgElement: SVGElement;
  svgContainerElement: HTMLDivElement;

  svgCtrl: GraphController;
  graphs: Graph[] = [];

  evalExpr: () => number | string;

  mc: HammerManager;

  isFirstLoad = true; // Used in ngAfterViewChecked to make sure it gets called once
  isInputContainerOpen = true;
  isMouseDownOnSvg = false;

  gesture: Gesture;

  resizeObserver: ResizeObserverPolyfill;

  constructor(public mathEvaluator: MathEvaluatorService, private gestureCtrl: GestureController) {
    this.evalExpr = mathEvaluator.evaluateAndFormat.bind(mathEvaluator);
  }

  ngAfterViewInit() {
    this.svgElement = this.svgRef.nativeElement;
    this.svgContainerElement = this.svgContainerRef.nativeElement;
    this.svgCtrl = new GraphController(this.svgElement);
    this.svgCtrl.onResize();

    this.graphs = [
      new Line('x', { stroke: 'var(--ion-color-dark)', strokeWidth: 3, fill: 'none' }, this.svgCtrl, this.mathEvaluator),
    ];

    this.resizeObserver = new ResizeObserverPolyfill(() => this.svgCtrl.onResize());
    this.resizeObserver.observe(this.svgContainerElement);

    let prevMousePos = new SvgCoordinate(0, 0);
    this.gesture = this.gestureCtrl.create({
      el: this.svgElement,
      threshold: 0,
      gestureName: 'pan',
      onStart: e => { prevMousePos = new SvgCoordinate(e.startX, e.startY); },
      onMove: e => {
        const currMousePos = new SvgCoordinate(e.currentX, e.currentY);
        const mousePosDiff = new SvgCoordinate(currMousePos.x - prevMousePos.x, currMousePos.y - prevMousePos.y);
        this.svgCtrl.pan(mousePosDiff);
        prevMousePos = currMousePos;
      }
    }, true);

    this.gesture.enable();

    this.svgContainerElement.addEventListener('wheel',
      (e: WheelEvent) => {
        const prevMouseCoord = this.getMousePosAsCoordinates(e);
        this.svgCtrl.zoom(e.deltaY < 0 ? -1 : 1);
        const newMouseCoord = this.getMousePosAsCoordinates(e);
        const mousePosDiff = { x: prevMouseCoord.x - newMouseCoord.x, y: prevMouseCoord.y - newMouseCoord.y };
        this.svgCtrl.panTo(new GraphCoordinate(this.svgCtrl.svgOffsetAsGraphCoords.x - mousePosDiff.x, this.svgCtrl.svgOffsetAsGraphCoords.y - mousePosDiff.y));
        this.svgCtrl.svgTransformSubject.next();
      }, { passive: false });
  }
  ngOnDestroy() {
    this.resizeObserver.unobserve(this.svgContainerElement);
    this.graphs.forEach(shape => shape.destroy());
    this.gesture.destroy();
  }

  getMousePosAsCoordinates(e: MouseEvent): GraphCoordinate {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    return this.svgCtrl.svgCoordToGraphCoord(new GraphCoordinate(e.clientX - rect.left, e.clientY - rect.top));
  }

  onTap(tapCount: number) {
    if (tapCount === 2) {
      this.svgCtrl.zoom(-2);
    }
  }

  addGraph(graphType: GraphType) {
    switch (graphType) {
      case 'Line':
        this.graphs.push(new Line('', { stroke: 'var(--ion-color-dark)', strokeWidth: 3, fill: 'none' }, this.svgCtrl, this.mathEvaluator));
        break;
      case 'Point':
        this.graphs.push(new Point('', { stroke: 'var(--ion-color-dark)', strokeWidth: 3, fill: 'var(--ion-color-primary)', radius: 6 }));
    }
  }

  removeGraph(index: number) {
    this.graphs.splice(index, 1);
  }
}
