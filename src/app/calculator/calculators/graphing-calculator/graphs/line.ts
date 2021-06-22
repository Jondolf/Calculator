import { interval, Subscription } from "rxjs";
import { debounce } from 'rxjs/operators';
import { MathEvaluatorService } from "src/app/calculator/math-evaluator/mathEvaluator.service";
import { GraphStyle } from ".";
import { Coordinate } from "../coordinate";
import { GraphingCalculatorSvgController } from "../graphing-calculator-svg-controller";
import { Graph } from "./graph";

enum Side {
  Top = 1,
  Right = 1,
  Bottom = -1,
  Left = -1
}
enum PathCommand {
  Move = 'M',
  Line = 'L',
  HorizontalLine = 'H',
  VerticalLine = 'V',
  Curve = 'C',
  SmoothCurve = 'S',
  QuadraticBezierCurve = 'Q',
  SmoothQuadraticBezierCurve = 'T',
  EllipticalArc = 'A',
  ClosePath = 'Z'
}
type Path = Array<{
  coordinate: Coordinate,
  command: PathCommand;
}>;

export class Line extends Graph {
  get equation(): string {
    return this._equation.toLowerCase().replace(/ /g, '');
  }
  set equation(value: string) {
    this._equation = value;
    this.setPath();
    this.setSvgPath();
    this.savedCoords = {};
  }
  private previousY: number;
  private savedCoords: { [stepBetweenCoordinates: string]: { [x: string]: number; }; } = {};
  svgTransformSubscription: Subscription;
  path: Path = [];
  svgPath: string;

  constructor(protected _equation: string, public style: GraphStyle, private svgCtrl: GraphingCalculatorSvgController, private mathEvaluator: MathEvaluatorService) {
    super('Line', _equation, style);
    this.svgTransformSubscription = svgCtrl.svgTransformSubject
      .pipe(debounce(() => interval(50)))
      .subscribe(() => { this.setPath(); this.setSvgPath(); });
  }

  destroy() {
    this.svgTransformSubscription.unsubscribe();
  }

  private setPath() {
    const isStraightLine = this.equation.match(/sin|cos|tan|log|ln|lg|sqrt|abs|pow|xx+|(x|\dx|x\d)\*(x|\dx|x\d)|^|(\d|x|\*)\(|\)(\d|x|\*)/g)[0] === '';
    let path: Path;
    if (isStraightLine) {
      const { left, right } = this.svgCtrl.svgSidesAsCoordinates;
      path = [
        { coordinate: new Coordinate(left, +this.mathEvaluator.evaluate(this.formatEquation(this.equation, left), false)), command: PathCommand.Move },
        { coordinate: new Coordinate(right, +this.mathEvaluator.evaluate(this.formatEquation(this.equation, right), false)), command: PathCommand.Line },
      ];
    } else {
      path = [
        ...this.getHalfOfPath(Side.Left, -this.stepBetweenX, this.equation),
        ...this.getHalfOfPath(Side.Right, this.stepBetweenX, this.equation)
      ];
    }
    this.path = path;
  }

  private setSvgPath() {
    const path = this.path.map((part) => {
      const { x, y } = this.svgCtrl.convertCoordinatesToSvgCoordinates(new Coordinate(part.coordinate.x, part.coordinate.y));
      return `${part.command} ${x} ${y}`;
    }).join(' ');
    this.svgPath = path;
  }

  private get stepBetweenX(): number {
    const stepBetweenX = 0.01;
    return stepBetweenX;
  }

  /**
   * Draws half of the line starting from the center of the coordinate system.
   * @param side The side that the line will go towards
   * @param numberStep How large the gap between each x-coordinate is (how often to calculate and draw a line)
   * @param equation The equation that will be used for calculating the y-coord at the current x-coord
   */
  private getHalfOfPath(side: Side, numberStep: number, equation: string): Path {
    this.previousY = 0;
    let prevAngle = NaN;
    const pannedSide = (side === Side.Left ? this.svgCtrl.svgSidesAsCoordinates.left : this.svgCtrl.svgSidesAsCoordinates.right) * +this.svgCtrl.stepBetweenCoordinates;
    const step = numberStep * +this.svgCtrl.stepBetweenCoordinates;
    const xCoords: number[] = [];
    const path: Path = [];
    for (
      let x = 0;
      side === Side.Right ? x <= pannedSide + +this.svgCtrl.stepBetweenCoordinates :
        (side === Side.Left ? x >= pannedSide - +this.svgCtrl.stepBetweenCoordinates : true);
      x += step
    ) {
      xCoords.push(x);
    }
    const yCoords = this.mathEvaluator.evaluateYValues(equation.slice(equation.lastIndexOf('=') + 1), xCoords);
    for (const [i, xCoord] of xCoords.entries()) {
      const x = xCoord / +this.svgCtrl.stepBetweenCoordinates;
      const changedHalf = (this.previousY < 0 && yCoords[i] > 0) || (this.previousY > 0 && yCoords[i] < 0);
      const angle = this.getAngleDegrees(new Coordinate(x - step, this.previousY), new Coordinate(x, yCoords[i]));
      if (this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()] === undefined) {
        this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()] = {};
      }
      if (this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x] === undefined) {
        this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x] = yCoords[i] / +this.svgCtrl.stepBetweenCoordinates;
      }
      const y = this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x];
      const coordinate = new Coordinate(x, y);
      if ((isNaN(this.previousY) && !isNaN(y)) || !isNaN(this.previousY) && isNaN(y)) {
        this.getPathSectionForNumbersCloseToNaN(coordinate, step, equation);
      }
      if (!isNaN(y)) {
        let shouldDraw = true;
        if (x === 0 || (changedHalf && Math.abs(angle - prevAngle) >= 178)) {
          shouldDraw = false;
        }
        path.push({ coordinate, command: shouldDraw ? PathCommand.Line : PathCommand.Move });
      }
      this.previousY = y;
      prevAngle = angle;
    }
    return path;
  }

  /**
   * Goes back one step, finds the closest value that isn't NaN and draws a line to it.\
   * Used when either the current or previous y value was NaN.\
   * This fixes bugs with things like y=sqrt(x+1) or y=ln(x).
   */
  getPathSectionForNumbersCloseToNaN(coordinate: Coordinate, stepBetweenX: number, equation: string): Path {
    return [{ coordinate: this.findValueClosestToNaN(coordinate.x - stepBetweenX, coordinate.x, this.previousY, coordinate.y, equation), command: PathCommand.Line }];
  }

  /**
   * Finds the number closest to NaN by using a binary-search-like algorithm
   */
  private findValueClosestToNaN(start: number, end: number, startValue: number, endValue: number, equation: string): Coordinate {
    const middle = (start + end) / 2;
    const middleValue = this.getOrCalculateY(equation, middle);
    if (Math.abs(end - start) < 0.00000000000000001 || middle === start || middle === end) {
      return new Coordinate(middle, middleValue);
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

  private getAngleDegrees(from: Coordinate, to: Coordinate) {
    const delta = { x: from.x - to.x, y: from.y - to.y };
    const radians = Math.atan2(delta.y, delta.x);
    const degrees = (((radians * 180) / Math.PI) - 180 + 360) % 360;
    return degrees;
  }

  private getOrCalculateY(equation: string, x: number): number {
    if (this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()] === undefined) {
      this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()] = {};
    }
    if (this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x] === undefined) {
      this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x] = +this.mathEvaluator.evaluate(this.formatEquation(equation, x), false);
    }
    return this.savedCoords[this.svgCtrl.stepBetweenCoordinates.toString()][x];
  }

  private formatEquation(equation: string, replaceWith: number): string {
    const replacedValue = `(${replaceWith})`;
    const formattedEquation: string = equation.replace(/x/g, replacedValue).slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }
}
