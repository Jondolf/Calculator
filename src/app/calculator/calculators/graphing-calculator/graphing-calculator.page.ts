import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { IonInput } from '@ionic/angular';
import { CalculatorService } from '../calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { GraphingCalculatorCanvasController } from './graphing-calculator-canvas-controller';
import { GraphingCalculatorDrawingController } from './graphing-calculator-drawing-controller';

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvascontainer') canvasContainerRef: ElementRef;

  canvasCtrl: GraphingCalculatorCanvasController;
  drawingCtrl: GraphingCalculatorDrawingController;

  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLDivElement;
  equations = ['y=x'];

  isFirstLoad = true; // Used in ngAfterViewChecked to make sure it gets called once
  isInputContainerOpen = true;
  isMouseDownOnCanvas = false;

  focusedEquationElement: IonInput;
  focusedEquationIndex: number;
  caretPosition: number;

  themeSubscription: Subscription;
  resizeObserveble: Observable<Event>;
  resizeSubscription: Subscription;

  constructor(private calculator: CalculatorService, private globals: GlobalVarsService) { }

  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.canvasElement = this.canvasRef.nativeElement;
    this.canvasContainerElement = this.canvasContainerRef.nativeElement;

    this.resizeObserveble = fromEvent(window, 'resize');
  }
  ngAfterViewChecked(): void {
    if (this.isFirstLoad) {
      if (this.canvasElement.offsetWidth !== 0) {
        this.instantiateClasses();
        this.canvasCtrl.handleSetCanvasSize();
        this.setGraphColors();
        this.drawingCtrl.handleDraw();

        this.subscribeToThemeChanges();
        this.subscribeToResizeEvent();

        this.canvasContainerElement.addEventListener('wheel',
          (e: WheelEvent) => { this.canvasCtrl.zoom(e.deltaY < 0 ? -0.5 : 0.5); this.drawingCtrl.handleDraw(); }, { passive: false });

        this.isFirstLoad = false;
      }
    }
  }

  instantiateClasses(): void {
    this.canvasCtrl = new GraphingCalculatorCanvasController(this.canvasElement);
    this.drawingCtrl = new GraphingCalculatorDrawingController(
      this.canvasElement,
      this.canvasCtrl,
      this.calculator,
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

  subscribeToResizeEvent() {
    this.resizeSubscription = this.resizeObserveble.subscribe(() => {
      this.onResize();
    });
  }

  onResize() {
    // Set timeout for both to make sure they are called at the right time
    setTimeout(() => {
      this.canvasCtrl.handleSetCanvasSize();
      this.drawingCtrl.handleDraw();
    }, 500);
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
