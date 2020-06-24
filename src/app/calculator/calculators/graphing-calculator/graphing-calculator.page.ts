import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BasicCalculatorService } from '../basic-calculator/basic-calculator.service';
import { PanZoomConfig } from 'ng2-panzoom';

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
  squareBorderWidth = 1;
  squareBorderColor = 'rgba(175, 175, 175, 0.5)';

  coordinateSystemLineWidth = 2;
  coordinateSystemLineColor = 'black';

  equations = [];

  constructor(private calculator: BasicCalculatorService) { }

  ngAfterViewInit() {
    this.graphElement = this.graphRef.nativeElement;
    this.ctx = this.graphElement.getContext('2d');

    this.canvasHalfX = this.graphElement.width / 2;
    this.canvasHalfY = this.graphElement.height / 2;

    this.squareSize = this.graphElement.width / 100;
    this.amountOfXSquares = this.graphElement.width / this.squareSize;
    this.amountOfYSquares = this.graphElement.height / this.squareSize;

    this.ctx.font = '18px \'Nunito Sans\'';
    this.handleDraw();
  }

  changeEquation(index: number, newEquation: string): void {
    this.equations[index] = newEquation;
    console.log(this.equations);
  }

  // Used in a template for-loop to avoid an unfocus problem
  trackBy(index: number): number {
    return index;
  }

  // Draws the lines and shapes of all equations
  drawEquations(): void {
    this.handleDraw();
    for (const equation of this.equations) {
      this.drawLineFromEquation(equation);
      console.log(equation);
    }
  }

  drawLineFromEquation(equation: string): void {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHalfY);
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.graphElement.width / this.squareSize;
      coord.x += 0.25
    ) {
      this.ctx.lineTo(
        this.convertCoordinatesToCanvasCoordinates(coord).x,
        this.convertCoordinatesToCanvasCoordinates({ x: 0, y: +this.countEquation(this.formatEquation(equation, coord.x)) }).y
      );

    }
    this.ctx.stroke();
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
      this.coordinateSystemLineWidth, this.coordinateSystemLineColor,
      { x: 0, y: this.graphElement.height / 2 }, { x: this.graphElement.width, y: this.graphElement.height / 2 }
    );
    // y-axis
    this.drawAcrossCanvas(
      this.coordinateSystemLineWidth, this.coordinateSystemLineColor,
      { x: this.graphElement.width / 2, y: 0 }, { x: this.graphElement.width / 2, y: this.graphElement.height }
    );
    // Numbers along axes
    for (
      const coord = { x: -(this.canvasHalfX / this.squareSize), y: 0 };
      coord.x < this.graphElement.width / this.squareSize;
      coord.x++
    ) {
      // For now it uses coord.x for y-axis as well and presumes that the grid is a square
      if (coord.x !== 0) {
        this.ctx.fillText(
          coord.x.toString(), this.convertCoordinatesToCanvasCoordinates(coord).x - 6, this.graphElement.height / 2 + 22); // x-axis
        this.ctx.fillText(
          (-coord.x).toString(), this.graphElement.width / 2 - 20, this.convertCoordinatesToCanvasCoordinates(coord).x + 6); // y-axis
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
