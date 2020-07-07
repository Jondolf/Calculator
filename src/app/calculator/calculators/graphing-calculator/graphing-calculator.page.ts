import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CalculatorService } from '../calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { IonInput } from '@ionic/angular';

interface Coordinate {
  x: number;
  y: number;
}

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvascontainer') canvasContainerRef: ElementRef;

  themeSubscription: Subscription;

  resizeObserveble: Observable<Event>;
  resizeSubscription: Subscription;

  isMouseDownOnCanvas = false;
  caretPosition: number;

  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLDivElement;

  ctx: CanvasRenderingContext2D;
  canvasHalf: Coordinate = { x: 0, y: 0 };
  canvasCssTransforms = {
    translate: { x: 0, y: 0 } as Coordinate,
    scale: 1
  };
  scale = 10; // How many squares displayed on the x-axis
  // scaleAsInteger: number = +Math.round((this.canvasCssTransforms.scale + Number.EPSILON) * 10); // The scale rounded and multiplied
  // lastDigitOfIntScale: number = +this.scaleAsInteger.toString()[this.scaleAsInteger.toString().length - 1];

  firstLoad = true; // Used for settng initial canvas CSS transforms

  squareSize: number;
  amountOfSquares: Coordinate = { x: 0, y: 0 };
  squareBorderWidth = 5;
  squareBorderColor = 'rgba(175, 175, 175, 0.5)';

  gridStepBetweenNumbers: 1 | 2 | 5 = 1; // How large the step is between numbers, like 1 -> 2, 4 -> 6 or even 50 -> 100
  coordinateSystemColor = 'black';

  equations = [''];
  focusedEquationElement: IonInput;
  focusedEquationIndex: number;

  constructor(private calculator: CalculatorService, private globals: GlobalVarsService) { }

  ngOnInit(): void {
    this.resizeObserveble = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObserveble.subscribe(() => this.handleSetCanvasSize());

    this.themeSubscription = this.globals.currentThemeChange.subscribe((value) => {
      if (value.includes('light')) {
        this.coordinateSystemColor = 'black';
      } else {
        this.coordinateSystemColor = 'white';
      }
      this.drawInitial();
      this.drawEquations();
    });
    if (this.globals.currentTheme.includes('light')) {
      this.coordinateSystemColor = 'black';
    } else {
      this.coordinateSystemColor = 'white';
    }
  }
  ngOnDestroy(): void {
    this.resizeSubscription.unsubscribe();
    this.themeSubscription.unsubscribe();
  }
  ngAfterViewInit(): void {
    this.canvasElement = this.canvasRef.nativeElement;
    this.canvasContainerElement = this.canvasContainerRef.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');

    this.canvasContainerElement.addEventListener('wheel', (e: WheelEvent) => this.zoom(e.deltaY < 0 ? 0.9 : 1.1), { passive: false });
    this.setCanvasSizeRelatedVars();
    this.ctx.font = '24px \'Nunito Sans\'';
  }
  ngAfterViewChecked(): void {
    if (this.firstLoad) {
      this.canvasCssTransforms.translate = {
        x: 0,
        y: 0
      };
      if (this.canvasContainerElement.offsetWidth !== 0) {
        this.handleSetCanvasSize();
        this.firstLoad = false;
      }
    }
  }

  handleSetCanvasSize() {
    this.setCanvasSize();
    this.setCanvasSizeRelatedVars();
    this.drawEquations();
  }

  setCanvasSize() {
    this.canvasElement.width = this.canvasElement.height *
      (this.canvasElement.clientWidth / this.canvasElement.clientHeight);
  }
  /**
   * A helper function for setting canvas size and position related variables,
   * such as the canvas center coordinates, square size and amount of squares
   */
  setCanvasSizeRelatedVars(): void {
    this.squareSize = this.canvasElement.width / this.scale;
    this.canvasHalf = {
      x: this.canvasElement.width / 2,
      y: this.canvasElement.height / 2
    };
    this.amountOfSquares = {
      x: this.canvasElement.width / this.squareSize,
      y: this.canvasElement.height / this.squareSize
    };
  }
  setCanvasCssTransforms(): void {
    this.canvasElement.style.transform = `translate(${this.canvasCssTransforms.translate.x}px, ${this.canvasCssTransforms.translate.y}px) scale(${this.canvasCssTransforms.scale})`;
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
  }

  async addSpecialSymbolToEquation(symbol: string): Promise<void> {
    this.equations[this.focusedEquationIndex] = this.insertCharToString(
      symbol, this.equations[this.focusedEquationIndex], this.caretPosition);
    this.caretPosition = this.caretPosition + 1;
    this.focusedEquationElement.setFocus();
    this.drawEquations();
  }
  insertCharToString(char: string, str: string, index: number): string {
    return [str.slice(0, index), char, str.slice(index)].join('');
  }

  // Used in a template for-loop to avoid an unfocus problem
  trackBy(index: number): number {
    return index;
  }

  // Event handlers below
  async onEquationInputFocus(equationIndex: number, eventTarget: IonInput): Promise<void> {
    const inputElement: HTMLInputElement = await eventTarget.getInputElement();
    this.focusedEquationElement = eventTarget;
    this.focusedEquationIndex = equationIndex;
    this.caretPosition = inputElement.selectionStart;
  }
  onPan(event: HammerInput): void {
    this.canvasCssTransforms.translate = {
      x: this.canvasCssTransforms.translate.x + event.velocityX * ((1 + this.scale * this.squareSize) * 0.005),
      y: this.canvasCssTransforms.translate.y + event.velocityY * ((1 + this.scale * this.squareSize) * 0.005)
    };
    this.setCanvasCssTransforms();
  }

  zoom(amount: number): void {
    this.scale = Math.round(this.scale * amount);
    this.setCanvasSizeRelatedVars();
    this.drawEquations();
  }

  /**
   * Converts the given coordinate system coordinates to canvas coordinates
   * @param coordinate An object with the x and y coordinates that the function should convert to canvas coordinates
   */
  convertCoordinatesToCanvasCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: this.canvasHalf.x + (coordinate.x * this.squareSize),
      y: this.canvasHalf.y - (coordinate.y * this.squareSize)
    };
    return convertedCoordinate;
  }

  // Functions used for drawing below
  drawInitial(): void {
    this.clearCanvas();
    this.drawGrid(1, this.squareBorderWidth * 2.5, this.squareBorderColor); // Large squared grid
    this.drawGrid(0.2, this.squareBorderWidth, this.squareBorderColor); // Small squared grid (5 per 1 large square)
    this.drawCoordinateSystem();
  }

  /**
   * Draws the lines and shapes of all equations
   */
  drawEquations(): void {
    this.drawInitial();
    for (let equation of this.equations) {
      equation = equation.replace(/ /g, '');
      if (equation.split('=').length === 2 && equation.split('=')[1]) {
        this.drawLineFromEquation(equation);
      } else if (equation.split(',').length === 2) {
        const coords = equation.split(',');
        this.drawDotAtCoordinate(this.convertCoordinatesToCanvasCoordinates({ x: +coords[0], y: +coords[1] }));
      }
    }
  }

  /**
   * Draws a line by using a given equation. The calculation is done on every x-coordinate/part of x-coordinate
   * @param equation The equation used to count where to draw the line
   */
  drawLineFromEquation(equation: string): void {
    this.ctx.lineWidth = 6;
    // Functions that can create curves or other complex shapes
    const complexMathFunctions: string[] = ['xx', '^', '√', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
    // Does it have curves or other complex shapes or is it a very simple line/shape
    const isComplex: boolean = complexMathFunctions.some((value: string) => equation.includes(value));
    const roundedAmountOfXSquares = Math.round(this.amountOfSquares.x);
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHalf.y);
    for (
      const coord = { x: -Math.round(roundedAmountOfXSquares * 0.5), y: 0 };
      coord.x < roundedAmountOfXSquares;
      coord.x += isComplex ? 0.1 : 1
    ) {
      const newY: number = +this.calculator.countCalculation(this.formatEquation(equation, coord.x));
      if (!isNaN(newY)) {
        const newCoord = this.convertCoordinatesToCanvasCoordinates({ x: coord.x, y: newY });
        this.ctx.lineTo(
          newCoord.x,
          newCoord.y
        );
      }
    }
    this.ctx.stroke();
  }
  formatEquation(equation: string, replaceWith: any): string {
    const formattedEquation: string = equation.replace(/x/g, '(' + replaceWith + ')').slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }

  /**
  * Draws a dot/small circle to a given point on the canvas.
  * @param coordinate A canvas coordinate
  */
  drawDotAtCoordinate(coordinate: Coordinate): void {
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 10, 0, 2 * Math.PI, true);
    this.ctx.fill();
  }

  /**
   * Draws a grid on the canvas.
   * @param squareSizeMultiplier How large a square on the grid is
   * @param lineWidth How thick the lines are
   * @param strokeStyle The styles (such as color) of the lines
   */
  drawGrid(squareSizeMultiplier: number, lineWidth: number, strokeStyle: string): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();
    for (let i = 0; i < this.scale * 0.5; i += squareSizeMultiplier) {
      const canvasCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({ x: i, y: i });
      // Horizontal lines
      this.ctx.moveTo(0, canvasCoord.y + 0.5);
      this.ctx.lineTo(this.canvasElement.width, canvasCoord.y + 0.5);
      // Vertical lines
      this.ctx.moveTo(canvasCoord.x + 0.5, 0);
      this.ctx.lineTo(canvasCoord.x + 0.5, this.canvasElement.height);
    }
    for (let i = 0; i > -this.scale * 0.5; i -= squareSizeMultiplier) {
      const canvasCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({ x: i, y: i });
      // Horizontal lines
      this.ctx.moveTo(0, canvasCoord.y + 0.5);
      this.ctx.lineTo(this.canvasElement.width, canvasCoord.y + 0.5);
      // Vertical lines
      this.ctx.moveTo(canvasCoord.x + 0.5, 0);
      this.ctx.lineTo(canvasCoord.x + 0.5, this.canvasElement.height);
    }
    this.ctx.stroke();
  }

  drawCoordinateSystem(): void {
    this.ctx.lineWidth = this.squareBorderWidth * 2.5;
    this.ctx.strokeStyle = this.coordinateSystemColor;
    const canvasMidCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({ x: 0, y: 0 });
    // x-axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, canvasMidCoord.y + 0.5);
    this.ctx.lineTo(this.canvasElement.width, canvasMidCoord.y + 0.5);
    // y-axis
    this.ctx.moveTo(canvasMidCoord.x + 0.5, 0);
    this.ctx.lineTo(canvasMidCoord.x + 0.5, this.canvasElement.height);
    this.ctx.stroke();
    // Numbers along axes
    this.ctx.fillStyle = this.coordinateSystemColor;
    for (let i = 1; i < Math.ceil(this.scale * 0.5); i += 1) {
      const canvasCoord: number = this.convertCoordinatesToCanvasCoordinates({ x: i, y: 0 }).x;
      // x-axis
      this.ctx.textAlign = 'center';
      this.ctx.fillText(
        i.toString(),
        canvasCoord,
        canvasMidCoord.y + this.convertCoordinatesToCanvasCoordinates({ x: 0, y: 0.5 }).y);
      // y-axis
      this.ctx.textAlign = 'right';
      this.ctx.fillText(
        i.toString(),
        canvasMidCoord.x - this.convertCoordinatesToCanvasCoordinates({ x: 0.5, y: 0 }).x,
        canvasCoord);
    }
  }

  clearCanvas(): void {
    // Save transforms
    this.ctx.save();
    // Reset transforms to make clearRect work properly
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    // Restore transforms
    this.ctx.restore();
  }
}
