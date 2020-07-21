import { GraphingCalculatorCanvasController } from './graphing-calculator-canvas-controller';
import { CalculatorService } from '../calculator.service';
import { Coordinate } from 'src/app/models/coordinate.interface';
import { ContextStyles } from 'src/app/models/canvas-context-styles.interface';
import Decimal from 'decimal.js';

interface GraphValues {
  [x: string]: number;
}

export class GraphingCalculatorDrawingController {
  private previousY: number;
  private ctx = this.canvasElement.getContext('2d');
  savedYValues: GraphValues;

  constructor(
    private canvasElement: HTMLCanvasElement,
    private canvasCtrl: GraphingCalculatorCanvasController,
    public contextStyles: ContextStyles,
    public equations: string[],
    private calculator: CalculatorService) { }

  handleDraw() {
    this.drawInitial();
    this.drawEquations();
  }

  drawInitial(): void {
    this.clearCanvas();
    this.drawGrid(1, this.contextStyles.squareBorderWidth * 2.5, this.contextStyles.squareBorderColor); // Large squares
    this.drawGrid(0.2, this.contextStyles.squareBorderWidth, this.contextStyles.squareBorderColor); // Small squares (5 per 1 large square)
    this.drawCoordinateSystem();
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

  private drawGrid(squareSizeMultiplier: number, lineWidth: number, strokeStyle: string): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();

    // The halves of the horizontal and vertical sides are drawn seperately to ensure that they start from the center
    this.drawGridOnSide(squareSizeMultiplier, 'x', this.canvasCtrl.canvasSidesWithStep.top);
    this.drawGridOnSide(squareSizeMultiplier, 'y', this.canvasCtrl.canvasSidesWithStep.right);
    this.drawGridOnSide(-squareSizeMultiplier, 'x', this.canvasCtrl.canvasSidesWithStep.bottom);
    this.drawGridOnSide(-squareSizeMultiplier, 'y', this.canvasCtrl.canvasSidesWithStep.left);

    this.ctx.stroke();
  }

  private drawGridOnSide(stepBetweenLines: number, xOrY: 'x' | 'y', side: number): void {
    const canvasOffset = xOrY === 'x' ? this.canvasCtrl.canvasOffsetWithStep.y : this.canvasCtrl.canvasOffsetWithStep.x;
    for (let i = 0; side >= 0 ? i < side - canvasOffset : i > side - canvasOffset - 1; i += stepBetweenLines) {
      const canvasCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinatesWithStep({
        x: i + this.canvasCtrl.canvasOffsetWithStep.x, y: i + this.canvasCtrl.canvasOffsetWithStep.y
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

  private drawCoordinateSystem(): void {
    const canvasMidCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinatesWithStep({
      x: this.canvasCtrl.canvasOffsetWithStep.x, y: this.canvasCtrl.canvasOffsetWithStep.y
    });
    this.ctx.lineWidth = this.contextStyles.squareBorderWidth * 2.5;
    this.ctx.strokeStyle = this.contextStyles.coordinateSystemColor;
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

  private drawNumbersAlongAxes(): void {
    this.ctx.font = `${this.canvasCtrl.squareSizeWithStep * 0.25}px 'Nunito Sans'`;
    this.ctx.fillStyle = this.contextStyles.coordinateSystemColor;
    this.ctx.textAlign = 'center';
    this.drawNumbersAlongAxesOnSide(1, 'y', this.canvasCtrl.canvasSidesWithStep.top);
    this.drawNumbersAlongAxesOnSide(1, 'x', this.canvasCtrl.canvasSidesWithStep.right);
    this.drawNumbersAlongAxesOnSide(-1, 'y', this.canvasCtrl.canvasSidesWithStep.bottom);
    this.drawNumbersAlongAxesOnSide(-1, 'x', this.canvasCtrl.canvasSidesWithStep.left);
  }

  private drawNumbersAlongAxesOnSide(numberStep: number, xOrY: 'x' | 'y', side: number): void {
    const canvasMidCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinatesWithStep({
      x: this.canvasCtrl.canvasOffsetWithStep.x, y: this.canvasCtrl.canvasOffsetWithStep.y
    });
    const canvasOffset = (xOrY === 'x' ? this.canvasCtrl.canvasOffsetWithStep.x : this.canvasCtrl.canvasOffsetWithStep.y);
    for (let i = numberStep + canvasOffset; side >= 0 ? i < side + 1 : i > side - 1; i += numberStep) {
      const coord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinatesWithStep({ x: i, y: i });
      const num = new Decimal(i - canvasOffset).round().mul(this.canvasCtrl.stepBetweenCoordinates).toFixed();
      if (xOrY === 'x') {
        this.ctx.fillText(num, coord.x, canvasMidCoord.y + this.canvasCtrl.squareSizeWithStep * 0.4);
      } else {
        this.ctx.fillText(
          num, canvasMidCoord.x - this.canvasCtrl.squareSizeWithStep * 0.225, coord.y + this.canvasCtrl.squareSizeWithStep * 0.075);
      }
    }
  }

  private drawEquations(): void {
    for (let equation of this.equations) {
      equation = equation.replace(/ /g, '');
      if (equation.includes('y=') && equation.split('=').length === 2) {
        this.drawLineFromEquation(equation);
      } else if (equation.split(',').length === 2) {
        const coords = equation.replace(/\(/g, '').replace(/\)/g, '').split(',');
        this.drawDotAtCoordinate(this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
          x: +coords[0] + this.canvasCtrl.canvasOffset.x, y: +coords[1] + this.canvasCtrl.canvasOffset.y
        }));
      }
    }
  }

  private drawLineFromEquation(equation: string): void {
    this.ctx.lineWidth = this.contextStyles.squareBorderWidth * 2;
    this.ctx.strokeStyle = this.contextStyles.coordinateSystemColor;
    // Functions that can create curves or other complex shapes
    const complexMathFunctions = ['xx', '^', '√', 'sqrt', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
    const veryComplexMathFunctions = ['tan(xx)'];
    // Does it have curves or other complex shapes or is it a very simple line/shape
    const isComplex: boolean = complexMathFunctions.some((value: string) => equation.includes(value));
    const isVeryComplex: boolean = veryComplexMathFunctions.some((value: string) => equation.includes(value));
    const stepBetweenX = isVeryComplex ? 0.025 : (isComplex ? 0.1 : 1);
    this.previousY = 0;
    this.ctx.beginPath();
    this.drawLineEquationHalf(this.canvasCtrl.canvasSides.left, -stepBetweenX, equation);
    this.drawLineEquationHalf(this.canvasCtrl.canvasSides.right, stepBetweenX, equation);
    this.ctx.stroke();
  }

  /**
   * Draws half of the line starting from the center of the coordinate system.
   * @param side The side that the line will go towards
   * @param numberStep How large the gap between each x-coordinate is (how often to calculate and draw a line)
   * @param equation The equation that will be used for calculating the y-coord at the current x-coord
   */
  private drawLineEquationHalf(side: number, numberStep: number, equation: string) {
    this.previousY = 0;
    const pannedSide = side - this.canvasCtrl.canvasOffset.x; // The side, but it also adds the correct offset
    for (
      let x = 0;
      side >= 0
        ? x <= pannedSide + 1
        : x >= pannedSide - 1;
      x += numberStep
    ) {
      const y = this.getOrCalculate(equation, x);
      if ((isNaN(this.previousY) && !isNaN(y)) || !isNaN(this.previousY) && isNaN(y)) {
        const valueClosestToNaN: Coordinate = this.findValueClosestToNaN(x - numberStep, x, this.previousY, y, equation);
        const newCoord = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
          x: valueClosestToNaN.x + this.canvasCtrl.canvasOffset.x, y: valueClosestToNaN.y + this.canvasCtrl.canvasOffset.y
        });
        this.ctx.lineTo(
          newCoord.x,
          newCoord.y
        );
      }
      if (!isNaN(y)) {
        const newCoord = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
          x: x + this.canvasCtrl.canvasOffset.x,
          y: y + this.canvasCtrl.canvasOffset.y
        });
        if (x === 0) {
          this.ctx.moveTo(newCoord.x, newCoord.y);
        } else {
          this.ctx.lineTo(
            newCoord.x,
            newCoord.y
          );
        }
      }
      this.previousY = y;
    }
  }

  /**
   * Finds the number closest to NaN by using a binary-search-like algorithm
   */
  private findValueClosestToNaN(start: number, end: number, startValue: number, endValue: number, equation: string): Coordinate {
    const middle = (start + end) / 2;
    const middleValue = this.getOrCalculate(equation, middle);
    if (Math.abs(end - start) < 0.00000000000000001 || middle === start || middle === end) {
      return { x: middle, y: middleValue };
    }
    if (isNaN(startValue) && isNaN(middleValue)) {
      return this.findValueClosestToNaN(middle, end, middleValue, endValue, equation);
    }
    if (isNaN(startValue) && !isNaN(middleValue)) {
      return this.findValueClosestToNaN(start, middle, startValue, middleValue, equation);
    }
    if (isNaN(endValue) && isNaN(middleValue)) {
      return this.findValueClosestToNaN(start, middle, startValue, middleValue, equation);
    }
    if (isNaN(endValue) && !isNaN(middleValue)) {
      return this.findValueClosestToNaN(middle, end, middleValue, endValue, equation);
    }
  }

  private getOrCalculate(equation: string, x: number): number {
    if (this.savedYValues[x] === undefined) {
      this.savedYValues[x] = +this.calculator.countCalculation(this.formatEquation(equation, x));
    }
    return this.savedYValues[x];
  }

  private formatEquation(equation: string, replaceWith: any): string {
    const replacedValue: string = replaceWith[0] === '(' && replaceWith[replaceWith.toString().length - 1] === ')' ? replaceWith : `(${replaceWith})`;
    const formattedEquation: string = equation.replace(/x/g, replacedValue).slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }

  private drawDotAtCoordinate(coordinate: Coordinate): void {
    this.ctx.fillStyle = this.contextStyles.coordinateSystemColor;
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 20, 0, 2 * Math.PI, true);
    this.ctx.fill();
  }
}
