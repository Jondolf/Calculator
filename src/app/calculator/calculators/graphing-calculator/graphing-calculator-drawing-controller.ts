import { GraphingCalculatorCanvasController } from './graphing-calculator-canvas-controller';
import { CalculatorService } from '../calculator.service';
import { Coordinate } from 'src/app/models/coordinate.interface';
import { ContextStyles } from 'src/app/models/canvas-context-styles.interface';

interface GraphValues {
  [x: string]: number;
}

export class GraphingCalculatorDrawingController {
  previousY: number;
  savedYValues: GraphValues;
  ctx = this.canvasElement.getContext('2d');

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

  drawGrid(squareSizeMultiplier: number, lineWidth: number, strokeStyle: string): void {
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();

    // The halves of the horizontal and vertical sides are drawn seperately to ensure that they start from the center
    this.drawGridOnSide(squareSizeMultiplier, 'x', this.canvasCtrl.canvasSides.top);
    this.drawGridOnSide(squareSizeMultiplier, 'y', this.canvasCtrl.canvasSides.right);
    this.drawGridOnSide(-squareSizeMultiplier, 'x', this.canvasCtrl.canvasSides.bottom);
    this.drawGridOnSide(-squareSizeMultiplier, 'y', this.canvasCtrl.canvasSides.left);

    this.ctx.stroke();
  }

  drawGridOnSide(stepBetweenLines: number, xOrY: 'x' | 'y', side: number): void {
    const canvasOffset = xOrY === 'x' ? this.canvasCtrl.canvasOffset.y : this.canvasCtrl.canvasOffset.x;
    for (let i = 0; side >= 0 ? i < side - canvasOffset : i > side - canvasOffset - 1; i += stepBetweenLines) {
      const canvasCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
        x: i + this.canvasCtrl.canvasOffset.x, y: i + this.canvasCtrl.canvasOffset.y
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
    const canvasMidCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
      x: this.canvasCtrl.canvasOffset.x, y: this.canvasCtrl.canvasOffset.y
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

  drawNumbersAlongAxes(): void {
    this.ctx.font = `${this.canvasCtrl.squareSize * 0.25}px 'Nunito Sans'`;
    this.ctx.fillStyle = this.contextStyles.coordinateSystemColor;
    this.ctx.textAlign = 'center';
    this.drawNumbersAlongAxesOnSide(1, 'y', this.canvasCtrl.canvasSides.top);
    this.drawNumbersAlongAxesOnSide(1, 'x', this.canvasCtrl.canvasSides.right);
    this.drawNumbersAlongAxesOnSide(-1, 'y', this.canvasCtrl.canvasSides.bottom);
    this.drawNumbersAlongAxesOnSide(-1, 'x', this.canvasCtrl.canvasSides.left);
  }

  drawNumbersAlongAxesOnSide(numberStep: number, xOrY: 'x' | 'y', side: number): void {
    const canvasMidCoord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
      x: this.canvasCtrl.canvasOffset.x, y: this.canvasCtrl.canvasOffset.y
    });
    const canvasOffset = (xOrY === 'x' ? this.canvasCtrl.canvasOffset.x : this.canvasCtrl.canvasOffset.y);
    for (let i = numberStep + canvasOffset; side >= 0 ? i < side + 1 : i > side - 1; i += numberStep) {
      const coord: Coordinate = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({ x: i, y: i });
      if (xOrY === 'x') {
        this.ctx.fillText(Math.round(i - canvasOffset).toString(), coord.x,
          canvasMidCoord.y + this.canvasCtrl.squareSize * 0.4);
      } else {
        this.ctx.fillText(Math.round(i - canvasOffset).toString(), canvasMidCoord.x - this.canvasCtrl.squareSize * 0.225,
          coord.y + this.canvasCtrl.squareSize * 0.075);
      }
    }
  }

  drawEquations(): void {
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

  drawLineFromEquation(equation: string): void {
    this.ctx.lineWidth = this.contextStyles.squareBorderWidth * 1.5;
    this.ctx.strokeStyle = this.contextStyles.coordinateSystemColor;
    // Functions that can create curves or other complex shapes
    const complexMathFunctions = ['xx', '^', '√', 'sin', 'cos', 'tan', 'log', 'ln', 'lg'];
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
  drawLineEquationHalf(side: number, numberStep: number, equation: string) {
    this.previousY = 0;
    const pannedSide = side - this.canvasCtrl.canvasOffset.x; // The side, but it also adds the correct offset
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
            const newCoord = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
              x: i + this.canvasCtrl.canvasOffset.x, y: y2 + this.canvasCtrl.canvasOffset.y
            });
            this.ctx.lineTo(
              newCoord.x,
              newCoord.y
            );
          }
        }
      }
      if (!isNaN(y)) {
        const newCoord = this.canvasCtrl.convertCoordinatesToCanvasCoordinates({
          x: x + this.canvasCtrl.canvasOffset.x, y: y + this.canvasCtrl.canvasOffset.y
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

  drawDotAtCoordinate(coordinate: Coordinate): void {
    this.ctx.fillStyle = this.contextStyles.coordinateSystemColor;
    this.ctx.beginPath();
    this.ctx.arc(coordinate.x, coordinate.y, 20, 0, 2 * Math.PI, true);
    this.ctx.fill();
  }
}
