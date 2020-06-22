import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { BasicCalculatorService } from '../basic-calculator/basic-calculator.service';

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
  @ViewChild('graph') graphRef: ElementRef;

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

    this.squareSize = this.graphElement.width / 10;
    this.amountOfXSquares = this.graphElement.width / this.squareSize;
    this.amountOfYSquares = this.graphElement.height / this.squareSize;

    this.ctx.font = '30px \'Nunito Sans\'';
    this.ctx.scale(2, 2);
    // this.ctx.translate(this.graphElement.width / 2, this.graphElement.height / 2);
    this.handleDraw();
  }

  /**
   * Handles what should happen when the equation's input's value is changed. This function is called on each input.
   * @param equation The equation that the input's value is assigned to
   * @param value The current value of the input
   */
  handleEquationInputChange(equation: string, value: string): void {
    equation = value;
    this.handleDraw();

    this.ctx.beginPath();
    this.ctx.moveTo(0, this.canvasHalfY);
    for (
      const coord = { x: 0, y: 0 };
      coord.x < this.graphElement.width;
      coord.x += this.convertCoordinatesToCanvasCoordinates({ x: 1, y: 0 }).x
    ) {
      this.ctx.lineTo(coord.x, +this.countEquation(this.formatEquation(value, coord.x)));

    }
    this.ctx.stroke();
  }

  formatEquation(equation: string, replaceWith: any) {
    const formattedEquation = equation.replace(/x/g, replaceWith).slice(equation.lastIndexOf('=') + 1);
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
      x: coordinate.x < 0 ? this.canvasHalfX - (coordinate.x * this.squareSize) : this.canvasHalfX + (coordinate.x * this.squareSize),
      y: coordinate.y < 0 ? this.canvasHalfY - (coordinate.y * this.squareSize) : this.canvasHalfY + (coordinate.y * this.squareSize)
    };
    return convertedCoordinate;
  }

  zoomIn(amount: number): void {
    this.ctx.scale(amount, amount);
    this.handleDraw();
  }

  zoomOut(amount: number): void {
    this.ctx.scale(amount, amount);
    this.handleDraw();
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
    /*
    for (let i = 1; i < this.graphElement.width; i += this.squareSize) {
      this.ctx.fillText(i.toString(), i, this.graphElement.height / 2 + 5); // x-axis
      this.ctx.fillText(i.toString(), this.graphElement.width / 2 - 5, i); // y-axis
    }*/
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
