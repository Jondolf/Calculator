import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CalculatorService } from '../calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Subscription, Observable, fromEvent } from 'rxjs';
import { IonInput } from '@ionic/angular';

interface Coordinate {
  x: number;
  y: number;
}

interface GraphValues {
  [x: string]: number;
}

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvascontainer') canvasContainerRef: ElementRef;

  inputContainerOpen = true;

  themeSubscription: Subscription;

  resizeObserveble: Observable<Event>;
  resizeSubscription: Subscription;

  isMouseDownOnCanvas = false;
  caretPosition: number;

  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLDivElement;

  ctx: CanvasRenderingContext2D;
  canvasHalf: Coordinate = { x: 0, y: 0 };
  /**
   * The distances between the center of the canvas and each side of the canvas (in coordinate system units)
   */
  canvasSides = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  canvasOffset: Coordinate = { x: 0, y: 0 }; // Used for panning
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

  previousY = 0;
  savedYValues: GraphValues = {};

  constructor(private calculator: CalculatorService, private globals: GlobalVarsService) { }

  ngOnInit(): void {
    this.resizeObserveble = fromEvent(window, 'resize');
    this.resizeSubscription = this.resizeObserveble.subscribe(() => this.handleSetCanvasSize(0));

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
  }
  ngAfterViewChecked(): void {
    if (this.firstLoad) {
      if (this.canvasContainerElement.offsetWidth !== 0) {
        this.handleSetCanvasSize(0);
        this.firstLoad = false;
      }
    }
  }

  // Delay to set sizes at correct time (such as after CSS transition)
  handleSetCanvasSize(delay: number) {
    setTimeout(() => {
      this.setCanvasSize();
      this.setCanvasSizeRelatedVars();
      this.drawEquations();
    }, delay);
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
    this.ctx.font = `${this.squareSize * 0.25}px 'Nunito Sans'`;
    this.canvasHalf = {
      x: this.canvasElement.width / 2,
      y: this.canvasElement.height / 2
    };
    this.amountOfSquares = {
      x: this.canvasElement.width / this.squareSize,
      y: this.canvasElement.height / this.squareSize
    };
    this.setCanvasSides();
  }

  setCanvasSides() {
    this.canvasSides = {
      top: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).y,
      bottom: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: this.canvasElement.height }).y,
      left: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).x,
      right: this.convertCanvasCoordinatesToCoordinates({ x: this.canvasElement.width, y: 0 }).x
    };
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
    this.savedYValues = {};
  }

  async addSpecialSymbolToEquation(symbol: string): Promise<void> {
    if (this.focusedEquationElement && this.caretPosition) {
      this.equations[this.focusedEquationIndex] = this.insertCharToString(
        symbol, this.equations[this.focusedEquationIndex], this.caretPosition);
      this.caretPosition = this.caretPosition + 1;
      this.focusedEquationElement.setFocus();
      this.drawEquations();
    }
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
    this.canvasOffset = {
      x: this.canvasOffset.x + event.velocityX * (0.2 + this.scale * 0.1),
      y: this.canvasOffset.y - event.velocityY * (0.2 + this.scale * 0.1)
    };
    this.setCanvasSides();
    this.drawEquations();
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

  /**
   * Converts the given canvas coordinates to coordinate system coordinates
   * @param coordinate An object with the x and y coordinates that the function should convert to coordinate system coordinates
   */
  convertCanvasCoordinatesToCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: (coordinate.x <= 0 ? -coordinate.x : coordinate.x / this.squareSize) - this.amountOfSquares.x * 0.5,
      y: -((coordinate.y / this.squareSize) - this.amountOfSquares.y * 0.5)
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
        this.drawDotAtCoordinate(this.convertCoordinatesToCanvasCoordinates({
          x: +coords[0] + this.canvasOffset.x, y: +coords[1] + this.canvasOffset.y
        }));
      }
    }
  }

  /**
   * Draws a line by using a given equation. The calculation is done on every x-coordinate/part of x-coordinate
   * @param equation The equation used to count where to draw the line
   */
  drawLineFromEquation(equation: string): void {
    this.ctx.lineWidth = this.squareBorderWidth * 1.5;
    // Functions that can create curves or other complex shapes
    const complexMathFunctions = ['xx', '^', '√', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
    const veryComplexMathFunctions = ['tan(xx)'];
    // Does it have curves or other complex shapes or is it a very simple line/shape
    const isComplex: boolean = complexMathFunctions.some((value: string) => equation.includes(value));
    const isVeryComplex: boolean = veryComplexMathFunctions.some((value: string) => equation.includes(value));
    const stepBetweenX = isVeryComplex ? 0.025 : (isComplex ? 0.1 : 1);
    this.previousY = 0;
    this.ctx.beginPath();
    this.drawLineEquationHalf(this.canvasSides.left, -stepBetweenX, equation);
    this.drawLineEquationHalf(this.canvasSides.right, stepBetweenX, equation);
    this.ctx.stroke();
  }
  drawLineEquationHalf(side: number, numberStep: number, equation: string) {
    this.previousY = 0;
    const pannedSide = side - this.canvasOffset.x; // The side, but it also adds the correct offset
    for (
      let x = 0;
      side >= 0 ? x <= pannedSide + 1 : x >= pannedSide - 1;
      x += numberStep
    ) {
      const y = this.getOrCalculate(equation, x);
      if (isNaN(this.previousY) && !isNaN(y)) {
        for (
          let i = x - numberStep;
          side >= 0 ? i < x : i > x;
          i += numberStep * 0.1) {
          const y2: number = this.getOrCalculate(equation, i);
          if (!isNaN(y2)) {
            this.ctx.strokeStyle = 'red';
            const newCoord = this.convertCoordinatesToCanvasCoordinates({ x: i + this.canvasOffset.x, y: y2 + this.canvasOffset.y });
            this.ctx.lineTo(
              newCoord.x,
              newCoord.y
            );
          }
        }
      }
      if (!isNaN(y)) {
        const newCoord = this.convertCoordinatesToCanvasCoordinates({ x: x + this.canvasOffset.x, y: y + this.canvasOffset.y });
        if (x === 0) {
          this.ctx.moveTo(newCoord.x, newCoord.y);
        } else {
          this.ctx.strokeStyle = 'white';
          this.ctx.lineTo(
            newCoord.x,
            newCoord.y
          );
        }
      }
      this.previousY = y;
    }
  }
  formatEquation(equation: string, replaceWith: any): string {
    const formattedEquation: string = equation.replace(/x/g, '(' + replaceWith + ')').slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }
  getOrCalculate(equation: string, x: number): number {
    if (this.savedYValues[x] === undefined) {
      this.savedYValues[x] = +this.calculator.countCalculation(this.formatEquation(equation, x));
    }
    return this.savedYValues[x];
  }

  /**
   * Draws a dot/small circle to a given point on the canvas.
   * @param coordinate A canvas coordinate
   */
  drawDotAtCoordinate(coordinate: Coordinate): void {
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 20, 0, 2 * Math.PI, true);
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

    // The halves of the horizontal and vertical sides are drawn seperately to ensure that they start from the center
    this.drawGridOnSide(squareSizeMultiplier, 'x', this.canvasSides.top);
    this.drawGridOnSide(squareSizeMultiplier, 'y', this.canvasSides.right);
    this.drawGridOnSide(-squareSizeMultiplier, 'x', this.canvasSides.bottom);
    this.drawGridOnSide(-squareSizeMultiplier, 'y', this.canvasSides.left);

    this.ctx.stroke();
  }

  drawGridOnSide(stepBetweenLines: number, xOrY: 'x' | 'y', side: number): void {
    const canvasOffset = xOrY === 'x' ? this.canvasOffset.y : this.canvasOffset.x;
    for (let i = 0; side >= 0 ? i < side - canvasOffset : i > side - canvasOffset - 1; i += stepBetweenLines) {
      const canvasCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({
        x: i + this.canvasOffset.x, y: i + this.canvasOffset.y
      });
      if (xOrY === 'x') {
        this.ctx.moveTo(0, canvasCoord.y + 0.5);
        this.ctx.lineTo(this.canvasElement.width, canvasCoord.y + 0.5);
      } else {
        this.ctx.moveTo(canvasCoord.x + 0.5, 0);
        this.ctx.lineTo(canvasCoord.x + 0.5, this.canvasElement.height);
      }
    }
  }

  drawCoordinateSystem(): void {
    const canvasMidCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({
      x: this.canvasOffset.x, y: this.canvasOffset.y
    });
    this.ctx.lineWidth = this.squareBorderWidth * 2.5;
    this.ctx.strokeStyle = this.coordinateSystemColor;
    // x-axis
    this.ctx.beginPath();
    this.ctx.moveTo(0, canvasMidCoord.y + 0.5);
    this.ctx.lineTo(this.canvasElement.width, canvasMidCoord.y + 0.5);
    // y-axis
    this.ctx.moveTo(canvasMidCoord.x + 0.5, 0);
    this.ctx.lineTo(canvasMidCoord.x + 0.5, this.canvasElement.height);
    this.ctx.stroke();
    this.drawNumbersAlongAxes();
  }

  drawNumbersAlongAxes(): void {
    this.ctx.fillStyle = this.coordinateSystemColor;
    this.ctx.textAlign = 'center';

    this.drawNumbersAlongAxesOnSide(1, 'y', this.canvasSides.top);
    this.drawNumbersAlongAxesOnSide(1, 'x', this.canvasSides.right);
    this.drawNumbersAlongAxesOnSide(-1, 'y', this.canvasSides.bottom);
    this.drawNumbersAlongAxesOnSide(-1, 'x', this.canvasSides.left);
  }

  drawNumbersAlongAxesOnSide(numberStep: number, xOrY: 'x' | 'y', side: number): void {
    const canvasMidCoord: Coordinate = this.convertCoordinatesToCanvasCoordinates({
      x: this.canvasOffset.x, y: this.canvasOffset.y
    });
    const canvasOffset = (xOrY === 'x' ? this.canvasOffset.x : this.canvasOffset.y);
    for (let i = numberStep + canvasOffset; side >= 0 ? i < side + 1 : i > side - 1; i += numberStep) {
      const coord: Coordinate = this.convertCoordinatesToCanvasCoordinates({ x: i, y: i });
      if (xOrY === 'x') {
        this.ctx.fillText(Math.round(i - canvasOffset).toString(), coord.x,
          canvasMidCoord.y + this.squareSize * 0.4);
      } else {
        this.ctx.fillText(Math.round(i - canvasOffset).toString(), canvasMidCoord.x - this.squareSize * 0.225,
          coord.y + this.squareSize * 0.075);
      }
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
