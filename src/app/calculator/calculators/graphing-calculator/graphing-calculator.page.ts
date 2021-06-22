import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import ResizeObserverPolyfill from 'resize-observer-polyfill'; // Normal resize observer gave errors
import { Subscription } from 'rxjs';
import { MathEvaluatorService } from '../../math-evaluator/mathEvaluator.service';
import { Coordinate } from './coordinate';
import { GraphingCalculatorSvgController } from './graphing-calculator-svg-controller';
import { Graph, GraphType, Line, Point } from './graphs';

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('svg') svgRef: ElementRef;
  @ViewChild('svgcontainer') svgContainerRef: ElementRef;
  svgElement: SVGElement;
  svgContainerElement: HTMLDivElement;

  svgCtrl: GraphingCalculatorSvgController;
  graphs: Graph[] = [];

  mc: HammerManager;

  isFirstLoad = true; // Used in ngAfterViewChecked to make sure it gets called once
  isInputContainerOpen = true;
  isMouseDownOnSvg = false;

  themeSubscription: Subscription;
  resizeObserver: ResizeObserverPolyfill;

  constructor(private mathEvaluator: MathEvaluatorService) { }

  ngAfterViewInit() {
    this.svgElement = this.svgRef.nativeElement;
    this.svgContainerElement = this.svgContainerRef.nativeElement;
  }
  ngAfterViewChecked() {
    if (this.isFirstLoad) {
      this.svgCtrl = new GraphingCalculatorSvgController(this.svgElement);
      this.svgCtrl.onResize();
      this.graphs = [
        new Line('x', { stroke: 'var(--ion-color-dark)', strokeWidth: 3, fill: 'none' }, this.svgCtrl, this.mathEvaluator),
      ];

      this.resizeObserver = new ResizeObserverPolyfill(() => this.svgCtrl.onResize());

      this.resizeObserver.observe(this.svgContainerElement);

      this.mc = new Hammer(this.svgElement);
      this.mc.on('pan', (e) => { this.svgCtrl.pan(e); });

      this.svgContainerElement.addEventListener('wheel',
        (e: WheelEvent) => {
          const targetCoord = this.getMousePosAsCoordinates(e);
          const prevStepBetweenCoords = this.svgCtrl.stepBetweenCoordinates;
          this.svgCtrl.zoom(e.deltaY < 0 ? -1 : 1);
          const newMouseCoord = this.getMousePosAsCoordinates(e);
          const newStepBetweenCoords = this.svgCtrl.stepBetweenCoordinates;
          const mousePosDiff = new Coordinate(targetCoord.x - newMouseCoord.x, targetCoord.y - newMouseCoord.y);
          const stepDiff = +prevStepBetweenCoords - +newStepBetweenCoords;
          // console.log('mouse pos:', targetCoord, newMouseCoord);
          this.svgCtrl.svgOffsetAsCoordinates.x -= mousePosDiff.x + (stepDiff === 0 ? 0 : stepDiff / stepDiff);
          this.svgCtrl.svgOffsetAsCoordinates.y -= mousePosDiff.y + (stepDiff === 0 ? 0 : stepDiff / stepDiff);
          // console.log('svg offset:', this.svgCtrl.svgOffsetAsCoordinates);
          this.svgCtrl.svgOffset = this.svgCtrl.convertCoordinatesToSvgCoordinates(this.svgCtrl.svgOffsetAsCoordinates);
          this.svgCtrl.setSvgSidesAsCoordinates();
          this.svgCtrl.setAxisNumbers();
          this.svgCtrl.svgTransformSubject.next();
        }, { passive: false });

      this.isFirstLoad = false;
    }
  }
  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
    this.resizeObserver.unobserve(this.svgContainerElement);
    this.mc.off('pan');
    this.graphs.forEach(shape => shape.destroy());
  }

  getMousePosAsCoordinates(e: MouseEvent): Coordinate {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    return this.svgCtrl.convertSvgCoordinatesToCoordinates(new Coordinate(e.clientX - rect.left, e.clientY - rect.top));
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
