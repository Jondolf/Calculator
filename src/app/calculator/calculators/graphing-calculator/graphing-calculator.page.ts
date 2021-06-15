import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { IonInput } from '@ionic/angular';
import ResizeObserverPolyfill from 'resize-observer-polyfill'; // Normal resize observer gave errors
import { Subscription } from 'rxjs';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { MathEvaluatorService } from '../../math-evaluator/mathEvaluator.service';
import { GraphingCalculatorCanvasController } from './graphing-calculator-canvas-controller';
import { GraphingCalculatorDrawingController } from './graphing-calculator-drawing-controller';

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvascontainer') canvasContainerRef: ElementRef;

  canvasCtrl: GraphingCalculatorCanvasController;
  drawingCtrl: GraphingCalculatorDrawingController;

  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLDivElement;
  equations = ['y=x'];

  mc: HammerManager;

  isFirstLoad = true; // Used in ngAfterViewChecked to make sure it gets called once
  isInputContainerOpen = true;
  isMouseDownOnCanvas = false;

  focusedEquationElement: IonInput;
  focusedEquationIndex: number;
  caretPosition: number;

  themeSubscription: Subscription;

  resizeObserver: ResizeObserverPolyfill;

  constructor(private mathEvaluator: MathEvaluatorService, private globals: GlobalVarsService) { }

  ngAfterViewInit(): void {
    this.canvasElement = this.canvasRef.nativeElement;
    this.canvasContainerElement = this.canvasContainerRef.nativeElement;
  }
  ngAfterViewChecked(): void {
    if (this.isFirstLoad) {
      if (this.canvasElement.offsetWidth !== 0) {
        this.instantiateClasses();
        this.canvasCtrl.handleSetCanvasSize();
        this.setGraphColors();

        this.resizeObserver = new ResizeObserverPolyfill(() => {
          this.canvasCtrl.handleSetCanvasSize();
          this.drawingCtrl.handleDraw();
        });

        this.resizeObserver.observe(this.canvasContainerElement);

        setTimeout(() => {
          this.drawingCtrl.handleDraw();
        }, 0);

        this.mc = new Hammer(this.canvasElement);
        this.mc.on('pan', (e) => { this.canvasCtrl.pan(e); this.drawingCtrl.handleDraw(); });

        this.subscribeToThemeChanges();

        this.canvasContainerElement.addEventListener('wheel',
          (e: WheelEvent) => { this.canvasCtrl.zoom(e.deltaY < 0 ? -1 : 1); this.drawingCtrl.handleDraw(); }, { passive: false });

        this.isFirstLoad = false;
      }
    }
  }
  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
    this.resizeObserver.unobserve(this.canvasContainerElement);
    this.mc.off('pan');
  }

  instantiateClasses(): void {
    this.canvasCtrl = new GraphingCalculatorCanvasController(this.canvasElement);
    this.drawingCtrl = new GraphingCalculatorDrawingController(
      this.canvasElement,
      this.canvasCtrl,
      this.mathEvaluator,
      this.equations,
      { squareBorderWidth: 5, squareBorderColor: 'rgba(175, 175, 175, 0.5)', coordinateSystemColor: 'black' }
    );
  }

  subscribeToThemeChanges(): void {
    this.themeSubscription = this.globals.currentThemeChange.subscribe(() => {
      this.setGraphColors();
      this.drawingCtrl.handleDraw();
    });
  }

  onTap(tapCount: number): void {
    if (tapCount === 2) {
      this.canvasCtrl.zoom(-2);
      this.drawingCtrl.handleDraw();
    }
  }

  setGraphColors(): void {
    if (this.globals.currentTheme.includes('light')) {
      this.drawingCtrl.contextStyles.coordinateSystemColor = 'black';
    } else {
      this.drawingCtrl.contextStyles.coordinateSystemColor = 'white';
    }
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
    this.drawingCtrl.equations = this.equations;
    this.drawingCtrl.savedYValuesForEquation = {};
  }

  async onEquationInputFocus(equationIndex: number, eventTarget: IonInput): Promise<void> {
    const inputElement: HTMLInputElement = await eventTarget.getInputElement();
    this.focusedEquationElement = eventTarget;
    this.focusedEquationIndex = equationIndex;
    this.caretPosition = inputElement.selectionStart;
  }

  async addSpecialSymbolToEquation(symbol: string): Promise<void> {
    if (this.focusedEquationElement && this.caretPosition) {
      this.equations[this.focusedEquationIndex] = this.insertCharToString(
        symbol, this.equations[this.focusedEquationIndex], this.caretPosition);
      this.caretPosition = this.caretPosition + 1;
      this.focusedEquationElement.setFocus();
      this.drawingCtrl.handleDraw();
    }
  }
  insertCharToString(char: string, str: string, index: number): string {
    return [str.slice(0, index), char, str.slice(index)].join('');
  }

  // Used in a template for-loop to avoid an unfocus problem
  trackBy(index: number): number {
    return index;
  }
}
