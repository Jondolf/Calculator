import { interval, Subscription } from "rxjs";
import { debounce } from 'rxjs/operators';
import { MathEvaluatorService } from "src/app/calculator/math-evaluator/math-evaluator.service";
import { GraphStyle } from ".";
import { Coordinate, GraphCoordinate, SvgCoordinate } from "../coordinates";
import { GraphController } from "../graph-controller";
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
  coordinate: SvgCoordinate,
  command: PathCommand;
}>;

export class Line extends Graph {
  get equation(): string {
    return this._equation.toLowerCase().replace(/ /g, '');
  }
  set equation(value: string) {
    this._equation = value;
    this.savedCoords = {};
    this.setPath();
    this.setSvgPath();
  }
  private previousY: number;
  private savedCoords: { [stepBetweenCoordinates: string]: { [x: string]: number; }; } = {};
  svgTransformSubscription: Subscription;
  path: Path = [];
  svgPath = '';

  constructor(protected _equation: string, public style: GraphStyle, private svgCtrl: GraphController, private mathEvaluator: MathEvaluatorService) {
    super('Line', _equation, style);
    this.svgTransformSubscription = svgCtrl.svgTransformSubject
      .pipe(debounce(() => interval(30)))
      .subscribe(() => { this.setPath(); this.setSvgPath(); });
    mathEvaluator.isReady.then(() => {
      this.setPath();
      this.setSvgPath();
    });
  }

  destroy() {
    this.svgTransformSubscription.unsubscribe();
  }

  private setPath() {
    if (this.equation === '') {
      this.path = [];
      return;
    }
    const isStraightLine = this.equation.match(/sin|cos|tan|asin|acos|atan|asinh|acosh|atanh|lb|ln|lg|sqrt|√|abs|pow|xx+|(x|\dx|x\d)\*(x|\dx|x\d)|^|(\d|x|\*)\(|\)(\d|x|\*)/g)[0] === '';
    let path: Path;
    if (isStraightLine) {
      const { left, right } = this.svgCtrl.svgSidesAsGraphCoords;
      path = [
        { coordinate: new SvgCoordinate(left - +this.svgCtrl.stepBetweenCoords * 3, +this.mathEvaluator.evaluate(this.formatEquation(this.equation, left - +this.svgCtrl.stepBetweenCoords * 3), false)), command: PathCommand.Move },
        { coordinate: new SvgCoordinate(right + +this.svgCtrl.stepBetweenCoords * 3, +this.mathEvaluator.evaluate(this.formatEquation(this.equation, right + +this.svgCtrl.stepBetweenCoords * 3), false)), command: PathCommand.Line },
      ];
    } else {
      const stepBetweenX = 0.01;
      path = [
        ...this.getHalfOfPath(Side.Left, stepBetweenX, this.equation),
        ...this.getHalfOfPath(Side.Right, stepBetweenX, this.equation)
      ];
    }
    this.path = path;
  }

  private setSvgPath() {
    const path = this.path.map((part) => {
      const { x, y } = this.svgCtrl.graphCoordToSvgCoord(new GraphCoordinate(part.coordinate.x, part.coordinate.y));
      return `${part.command} ${x} ${y}`;
    }).join(' ');
    this.svgPath = path;
    return;
  }

  /**
   * Draws half of the line starting from the center of the coordinate system.
   * @param side The side that the line will go towards
   * @param numberStep How large the gap between each x-coordinate is (how often to calculate and draw a line)
   * @param equation The equation that will be used for calculating the y-coord at the current x-coord
   */
  private getHalfOfPath(side: Side, numberStep: number, equation: string): Path {
    const isOutOfBounds = side === Side.Left ? 0 <= this.svgCtrl.svgSidesAsGraphCoords.left : 0 >= this.svgCtrl.svgSidesAsGraphCoords.right;
    if (isOutOfBounds) {
      return [];
    }
    this.previousY = 0;
    let prevAngle = NaN;
    const extraSpace = side === Side.Left ? +this.svgCtrl.stepBetweenCoords * -3 : +this.svgCtrl.stepBetweenCoords * 3;
    const start = (0 <= this.svgCtrl.svgSidesAsGraphCoords.right && 0 * +this.svgCtrl.stepBetweenCoords >= this.svgCtrl.svgSidesAsGraphCoords.left ? 0 : (
      side === Side.Right
        ? this.svgCtrl.svgSidesAsGraphCoords.left - extraSpace
        : this.svgCtrl.svgSidesAsGraphCoords.right - extraSpace
    ));
    const end = (side === Side.Left ? this.svgCtrl.svgSidesAsGraphCoords.left : this.svgCtrl.svgSidesAsGraphCoords.right) + extraSpace;
    const step = side * numberStep * +this.svgCtrl.stepBetweenCoords;
    const xCoords: number[] = [];
    const path: Path = [];
    for (
      let x = start;
      side === Side.Right ? x <= end :
        (side === Side.Left ? x >= end : false);
      x += step
    ) {
      xCoords.push(x);
    }
    const yCoords = this.mathEvaluator.evaluateYValues(equation.slice(equation.lastIndexOf('=') + 1), xCoords);
    for (const [i, x] of xCoords.entries()) {
      const changedHalf = (this.previousY < 0 && yCoords[i] > 0) || (this.previousY > 0 && yCoords[i] < 0);
      const angle = this.getAngleDegrees(new GraphCoordinate(x - step, this.previousY), new GraphCoordinate(x, yCoords[i]));
      if (this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()] === undefined) {
        this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()] = {};
      }
      if (this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x] === undefined) {
        this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x] = yCoords[i];
      }
      const y = this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x];
      const coordinate = new GraphCoordinate(x, y);
      if ((isNaN(this.previousY) && !isNaN(y)) || !isNaN(this.previousY) && isNaN(y)) {
        // this.findCoordinateNextToNaN(coordinate, step, equation)[0];
        path.push({ coordinate: { x, y: this.previousY }, command: PathCommand.Move });
      }
      if (!isNaN(y)) {
        let shouldDraw = true;
        if (i === 0 || (changedHalf && Math.abs(angle - prevAngle) >= 178.5 && Math.abs(angle - prevAngle) <= 181.5)) {
          shouldDraw = false;
        }
        path.push({ coordinate, command: shouldDraw ? PathCommand.Line : PathCommand.Move });
      }
      this.previousY = !isNaN(y) ? y : this.previousY;
      prevAngle = angle;
    }
    return path;
  }

  /**
   * Goes back one step, finds the closest value that isn't NaN and returns that coordinate.\
   * Used when either the current or previous y value was NaN.\
   * This fixes bugs with things like f(x)=sqrt(x+1) or f(x)=ln(x).
   */
  findCoordinateNextToNaN(coordinate: GraphCoordinate, stepBetweenX: number, equation: string): GraphCoordinate {
    return this.findValueClosestToNaN(coordinate.x - stepBetweenX, coordinate.x, this.previousY, coordinate.y, equation);
  }

  /**
   * Finds the number closest to NaN by using a binary-search-like algorithm
   */
  private findValueClosestToNaN(start: number, end: number, startValue: number, endValue: number, equation: string): GraphCoordinate {
    const middle = (start + end) / 2;
    const middleValue = this.getOrCalculateY(equation, middle);
    if (Math.abs(end - start) < 0.00000000000000001 || middle === start || middle === end) {
      return new GraphCoordinate(middle, middleValue);
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
    if (this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()] === undefined) {
      this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()] = {};
    }
    if (this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x] === undefined) {
      this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x] = +this.mathEvaluator.evaluate(this.formatEquation(equation, x), false);
    }
    return this.savedCoords[this.svgCtrl.stepBetweenCoords.toString()][x];
  }

  private formatEquation(equation: string, replaceWith: number): string {
    const replacedValue = `(${replaceWith})`;
    const formattedEquation: string = equation.replace(/x/g, replacedValue).slice(equation.lastIndexOf('=') + 1);
    return formattedEquation;
  }
}
