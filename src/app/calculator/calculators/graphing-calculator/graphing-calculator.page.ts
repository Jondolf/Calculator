import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BasicCalculatorService } from '../basic-calculator/basic-calculator.service';
import { PanZoomConfig } from 'ng2-panzoom';
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
export class GraphingCalculatorPage implements AfterViewInit {
  @ViewChild('canvas') graphRef: ElementRef;

  panZoomConfig = new PanZoomConfig({
    zoomLevels: 15,
    neutralZoomLevel: 5,
    initialZoomLevel: 10,
    scalePerZoomLevel: 1.5,
    invertMouseWheel: true,
    freeMouseWheel: false,
    zoomSetDuration: 1,
    keepInBounds: true
  });

  graphElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasHalfX: number;
  canvasHalfY: number;

  squareSize: number;
  amountOfXSquares: number;
  amountOfYSquares: number;
  squareBorderWidth = 2;
  squareBorderColor = 'rgba(175, 175, 175, 0.5)';

  coordinateSystemLineWidth = 4;
  coordinateSystemColor = 'black';

  equations = [];

  constructor(private calculator: BasicCalculatorService, private globals: GlobalVarsService) {
    globals.currentThemeChange.subscribe((value) => {
      if (value.includes('light')) {
        this.coordinateSystemColor = 'black';
      } else {
        this.coordinateSystemColor = 'white';
      }
      this.handleDraw();
      this.drawEquations();
    });

    if (globals.currentTheme.includes('light')) {
      this.coordinateSystemColor = 'black';
    } else {
      this.coordinateSystemColor = 'white';
    }
  }

  ngAfterViewInit() {
    this.graphElement = this.graphRef.nativeElement;
    this.ctx = this.graphElement.getContext('2d');

    this.canvasHalfX = this.graphElement.width / 2;
    this.canvasHalfY = this.graphElement.height / 2;

    this.squareSize = this.graphElement.width / 100;
    this.amountOfXSquares = this.graphElement.width / this.squareSize;
    this.amountOfYSquares = this.graphElement.height / this.squareSize;

    this.ctx.font = '24px \'Nunito Sans\'';
    this.handleDraw();
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
  }

  // Used in a template for-loop to avoid an unfocus problem
  trackBy(index: number): number {
    return index;
  }

  // Draws the lines and shapes of all equations
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
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHalfY);
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.graphElement.width / this.squareSize;
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

  handleDraw() {
    this.clearCanvas();
    this.drawGrid();
    this.drawCoordinateSystem();
  }

  drawGrid() {
    for (let i = 0; i < this.graphElement.width; i += this.squareSize) {
      // Horizontal lines
      this.drawAcrossCanvas(
        this.squareBorderWidth, this.squareBorderColor,
        { x: 0, y: i }, { x: this.graphElement.width, y: i }
      );
      // Vertical lines
      this.drawAcrossCanvas(
        this.squareBorderWidth, this.squareBorderColor,
        { x: i, y: 0 }, { x: i, y: this.graphElement.height }
      );
    }
  }

  drawCoordinateSystem() {
    // x-axis
    this.drawAcrossCanvas(
      this.coordinateSystemLineWidth, this.coordinateSystemColor,
      { x: 0, y: this.graphElement.height / 2 }, { x: this.graphElement.width, y: this.graphElement.height / 2 }
    );
    // y-axis
    this.drawAcrossCanvas(
      this.coordinateSystemLineWidth, this.coordinateSystemColor,
      { x: this.graphElement.width / 2, y: 0 }, { x: this.graphElement.width / 2, y: this.graphElement.height }
    );
    this.ctx.fillStyle = this.coordinateSystemColor;
    // Numbers along axes
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.graphElement.width / this.squareSize;
      coord.x++
    ) {
      // For now it uses coord.x for y-axis as well and presumes that the grid is a square
      if (coord.x !== 0) {
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
          coord.x.toString(), this.convertCoordinatesToCanvasCoordinates(coord).x, this.graphElement.height / 2 + 35); // x-axis
        this.ctx.textAlign = 'right';
        this.ctx.fillText(
          (-coord.x).toString(), this.graphElement.width / 2 - 20, this.convertCoordinatesToCanvasCoordinates(coord).x + 9); // y-axis
      }
    }
  }

  drawAcrossCanvas(lineWidth: number, strokeStyle: string, from: Coordinate, to: Coordinate): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;

    // this.ctx.save();
    // this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.beginPath();
    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);
    this.ctx.stroke();
    // this.ctx.restore();
  }

  clearCanvas() {
    // Save transforms
    this.ctx.save();
    // Reset transforms to make clearRect work properly
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.clearRect(0, 0, this.graphElement.width, this.graphElement.height);
    // Restore transforms
    this.ctx.restore();
  }
}
