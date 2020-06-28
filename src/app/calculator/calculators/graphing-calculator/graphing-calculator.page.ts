import { Component, ViewChild, ElementRef, OnInit, OnDestroy, AfterViewChecked } from '@angular/core';
import { BasicCalculatorService } from '../basic-calculator/basic-calculator.service';
import { GlobalVarsService } from 'src/app/global-vars.service';

interface Coordinate {
  x: number;
  y: number;
}

@Component({
  selector: 'app-graphing-calculator',
  templateUrl: './graphing-calculator.page.html',
  styleUrls: ['./graphing-calculator.page.scss'],
})
export class GraphingCalculatorPage implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('canvas') canvasRef: ElementRef;
  @ViewChild('canvascontainer') canvasContainerRef: ElementRef;

  canvasElement: HTMLCanvasElement;
  canvasContainerElement: HTMLDivElement;

  ctx: CanvasRenderingContext2D;
  canvasHalfX: number;
  canvasHalfY: number;
  canvasCssTransforms = {
    translate: { x: 0, y: 0 } as Coordinate,
    scale: 0.25
  };

  squareSize: number;
  amountOfXSquares: number;
  amountOfYSquares: number;
  squareBorderWidth = 4;
  squareBorderColor = 'rgba(175, 175, 175, 0.5)';

  coordinateSystemLineWidth = 6;
  coordinateSystemColor = 'black';

  equations = [];

  constructor(private calculator: BasicCalculatorService, private globals: GlobalVarsService) { }

  ngOnInit(): void {
    this.globals.currentThemeChange.subscribe((value) => {
      if (value.includes('light')) {
        this.coordinateSystemColor = 'black';
      } else {
        this.coordinateSystemColor = 'white';
      }
      this.handleDraw();
      this.drawEquations();
    });
    if (this.globals.currentTheme.includes('light')) {
      this.coordinateSystemColor = 'black';
    } else {
      this.coordinateSystemColor = 'white';
    }
  }
  ngOnDestroy(): void {
    this.globals.currentThemeChange.unsubscribe();
  }
  ngAfterViewChecked(): void {
    this.canvasElement = this.canvasRef.nativeElement;
    this.canvasContainerElement = this.canvasContainerRef.nativeElement;
    this.ctx = this.canvasElement.getContext('2d');

    this.canvasHalfX = this.canvasElement.width / 2;
    this.canvasHalfY = this.canvasElement.height / 2;

    this.squareSize = this.canvasElement.width / 100;
    this.amountOfXSquares = this.canvasElement.width / this.squareSize;
    this.amountOfYSquares = this.canvasElement.height / this.squareSize;

    this.canvasCssTransforms.translate = {
      x: -this.canvasHalfX + this.canvasContainerElement.offsetWidth * 0.5,
      y: -this.canvasHalfY + this.canvasContainerElement.offsetHeight * 0.5
    };
    this.setCanvasTransforms();

    this.ctx.font = '32px \'Nunito Sans\'';

    this.handleDraw();
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
  }

  // Used in a template for-loop to avoid an unfocus problem
  trackBy(index: number): number {
    return index;
  }

  /**
   * Draws the lines and shapes of all equations
   */
  drawEquations(): void {
    this.handleDraw();
    for (let equation of this.equations) {
      equation = equation.replace(/ /g, '');
      if (equation.includes('=')) {
        this.drawLineFromEquation(equation);
      } else if (equation.split(',').length === 2) {
        const coords = equation.split(',');
        this.drawDotAtCoordinate(this.convertCoordinatesToCanvasCoordinates({ x: coords[0], y: coords[1] }));
      }
    }
  }

  /**
   * Draws a line by using a given equation. The calculation is done on every x-coordinate/part of x-coordinate
   * @param equation The equation used to count where to draw the line
   */
  drawLineFromEquation(equation: string): void {
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHalfY);
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.canvasElement.width / this.squareSize;
      coord.x += 0.1
    ) {
      this.ctx.lineTo(
        this.convertCoordinatesToCanvasCoordinates(coord).x,
        this.convertCoordinatesToCanvasCoordinates({ x: 0, y: +this.countEquation(this.formatEquation(equation, coord.x)) }).y
      );

    }
    this.ctx.stroke();
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

  formatEquation(equation: string, replaceWith: any): string {
    const formattedEquation: string = equation.replace(/x/g, '(' + replaceWith + ')').slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }

  countEquation(equation: string): string {
    return this.calculator.countCalculation(equation);
  }

  /**
   * Converts the given coordinate system coordinates to canvas coordinates
   * @param coordinate An object with the x and y coordinates that the function should convert to canvas coordinates
   */
  convertCoordinatesToCanvasCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: this.canvasHalfX + (coordinate.x * this.squareSize),
      y: this.canvasHalfY - (coordinate.y * this.squareSize)
    };
    return convertedCoordinate;
  }

  onPan(event): void {
    this.canvasCssTransforms.translate = {
      x: this.canvasCssTransforms.translate.x + event.deltaX * 0.005,
      y: this.canvasCssTransforms.translate.y + event.deltaY * 0.005
    };
    this.setCanvasTransforms();
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY < 0) {
      this.canvasCssTransforms.scale += 0.1;
    } else if (event.deltaY > 0 && this.canvasCssTransforms.scale - 0.1 >= 0) {
      this.canvasCssTransforms.scale -= 0.1;
    }
    this.setCanvasTransforms();
  }

  onPinchIn() {
    if (this.canvasCssTransforms.scale - 0.1 >= 0) {
      this.canvasCssTransforms.scale -= 0.1;
      this.setCanvasTransforms();
    }
  }
  onPinchOut() {
    this.canvasCssTransforms.scale += 0.1;
    this.setCanvasTransforms();
  }

  // CSS transforms
  setCanvasTransforms() {
    this.canvasElement.style.transform = `translate(${this.canvasCssTransforms.translate.x}px, ${this.canvasCssTransforms.translate.y}px) scale(${this.canvasCssTransforms.scale})`;
  }

  handleDraw(): void {
    this.clearCanvas();
    this.drawGrid();
    this.drawCoordinateSystem();
  }

  drawGrid(): void {
    for (let i = 0; i < this.canvasElement.width; i += this.squareSize) {
      // Horizontal lines
      this.drawAcrossCanvas(
        this.squareBorderWidth, this.squareBorderColor,
        { x: 0, y: i }, { x: this.canvasElement.width, y: i }
      );
      // Vertical lines
      this.drawAcrossCanvas(
        this.squareBorderWidth, this.squareBorderColor,
        { x: i, y: 0 }, { x: i, y: this.canvasElement.height }
      );
    }
  }

  drawCoordinateSystem(): void {
    // x-axis
    this.drawAcrossCanvas(
      this.coordinateSystemLineWidth, this.coordinateSystemColor,
      { x: 0, y: this.canvasElement.height / 2 }, { x: this.canvasElement.width, y: this.canvasElement.height / 2 }
    );
    // y-axis
    this.drawAcrossCanvas(
      this.coordinateSystemLineWidth, this.coordinateSystemColor,
      { x: this.canvasElement.width / 2, y: 0 }, { x: this.canvasElement.width / 2, y: this.canvasElement.height }
    );
    this.ctx.fillStyle = this.coordinateSystemColor;
    // Numbers along axes
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.canvasElement.width / this.squareSize;
      coord.x++
    ) {
      // For now it uses coord.x for y-axis as well and presumes that the grid is a square
      if (coord.x !== 0) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          coord.x.toString(), this.convertCoordinatesToCanvasCoordinates(coord).x, this.canvasElement.height / 2 + 50); // x-axis
        this.ctx.textAlign = 'right';
        this.ctx.fillText(
          (-coord.x).toString(), this.canvasElement.width / 2 - 25, this.convertCoordinatesToCanvasCoordinates(coord).x + 9); // y-axis
      }
    }
  }

  drawAcrossCanvas(lineWidth: number, strokeStyle: string, from: Coordinate, to: Coordinate): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;

    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
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
