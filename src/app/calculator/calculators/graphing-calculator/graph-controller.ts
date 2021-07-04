import Decimal from 'decimal.js';
import { Subject } from 'rxjs';
import { GraphCoordinate, SvgCoordinate } from './coordinates';

export class GraphController {
  /**
   * The distances between the center of the svg and each side of the svg in svg coordinates
   */
  svgSides = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  /**
   * The distances between the center of the svg and each side of the svg in graph coordinates
   */
  svgSidesAsGraphCoords = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  svgMiddle = new SvgCoordinate(0, 0);
  svgOffset = new SvgCoordinate(0, 0);
  svgOffsetAsGraphCoords = new GraphCoordinate(0, 0);
  zoomLevel = 10;
  svgTransformSubject = new Subject<void>();
  visibleGridSize: { width: number, height: number; };
  axisNumbers = {
    x: {
      positive: [] as string[],
      negative: [] as string[]
    },
    y: {
      positive: [] as string[],
      negative: [] as string[]
    }
  };
  squareSize = 0;
  stepBetweenCoords = new Decimal(1); // Decimal.js is used to avoid floating point problems
  //  When zoomLevel is under stepRange.min, the step decreases. When zoomLevel is over stepRange.max, the step increases.
  private stepRange: { min: number, max: number; } = { min: 10, max: 20 };

  constructor(private svgElement: SVGElement) { }

  pan(delta: SvgCoordinate) {
    this.svgOffset.x += delta.x;
    this.svgOffset.y += delta.y;
    this.svgOffsetAsGraphCoords = this.svgCoordToGraphCoord(this.svgOffset);
    this.setSvgSidesAsGraphCoords();
    this.setAxisNumbers();
    this.svgTransformSubject.next();
  }

  panTo(coord: GraphCoordinate) {
    this.svgOffsetAsGraphCoords = coord;
    this.svgOffset = this.graphCoordToSvgCoord(coord);
    this.setSvgSidesAsGraphCoords();
    this.setAxisNumbers();
    this.svgTransformSubject.next();
  }

  zoom(amount: number) {
    this.zoomLevel += amount * +this.stepBetweenCoords;
    this.setStepBetweenCoords();
    this.setSvgSizeVars();
    this.svgTransformSubject.next();
  }

  setStepBetweenCoords() {
    const stepAsString: string = this.stepBetweenCoords.toFixed();
    const stepNumber: number = +stepAsString.replace(/0/g, '').replace(/\./g, ''); // The number without the zeroes, can be 1, 2 or 5
    const stepSplitAtDot: string[] = stepAsString.split('.'); // Used for checking if the value includes decimals
    const stepMultiplier = new Decimal(stepSplitAtDot.length === 1
      ? '1' + stepSplitAtDot[0].slice(1)
      : '0.' + stepSplitAtDot[1].slice(0, stepSplitAtDot[1].length - 1) + '1'); // The multiplier, like 1, 10, 10000, 0.1, 0.01 etc.

    // Default values that will be used if the zoomLevel isn't in the range
    let newStep = this.stepBetweenCoords;
    const newRange = { min: this.stepRange.min, max: this.stepRange.max };

    // When zoomLevel is over the specified range (e.g. after zooming out), increase the step and range by a certain amount
    if (this.zoomLevel > this.stepRange.max) {
      switch (stepNumber) {
        case 1:
          newStep = stepMultiplier.mul(2);
          break;
        case 2:
          newStep = stepMultiplier.mul(5);
          break;
        case 5:
          newStep = stepMultiplier.mul(10);
      }
      newRange.max = +newStep * 20;
      newRange.min = +newStep * 10;
      this.zoomLevel = newRange.min;
    }
    // When zoomLevel is below the specified range (e.g. after zooming in), decrease the step and range by a certain amount
    else if (this.zoomLevel < this.stepRange.min) {
      switch (stepNumber) {
        case 1:
          newStep = stepMultiplier.mul('0.5');
          break;
        case 2:
          newStep = stepMultiplier;
          break;
        case 5:
          newStep = stepMultiplier.mul(2);
      }
      newRange.max = +newStep * 20;
      newRange.min = +newStep * 10;
      this.zoomLevel = newRange.max;
    }
    this.stepBetweenCoords = newStep;
    this.stepRange = newRange;
  }

  onResize(delay?: number) {
    // Set delay only if necessary, such as for CSS transitions
    if (delay) {
      setTimeout(() => {
        this.setSvgSizeVars();
        this.svgTransformSubject.next();
      }, delay);
    } else {
      this.setSvgSizeVars();
      this.svgTransformSubject.next();
    }
  }

  setSvgSizeVars() {
    this.squareSize = this.svgElement.clientWidth / this.zoomLevel * +this.stepBetweenCoords;
    this.svgMiddle = {
      x: this.svgElement.clientWidth / 2,
      y: this.svgElement.clientHeight / 2
    };
    this.visibleGridSize = {
      width: this.svgElement.clientWidth / this.squareSize,
      height: this.svgElement.clientHeight / this.squareSize
    };
    this.svgOffset = this.graphCoordToSvgCoord(this.svgOffsetAsGraphCoords);
    this.setSvgSides();
    this.setSvgSidesAsGraphCoords();
    this.setAxisNumbers();
  }

  setSvgSides() {
    this.svgSides = {
      top: 0,
      right: this.svgElement.clientWidth,
      bottom: this.svgElement.clientHeight,
      left: 0
    };
  }

  setSvgSidesAsGraphCoords() {
    this.svgSidesAsGraphCoords = {
      top: this.svgCoordToGraphCoord(new SvgCoordinate(0, 0)).y - this.svgOffsetAsGraphCoords.y,
      right: this.svgCoordToGraphCoord(new SvgCoordinate(this.svgElement.clientWidth, 0)).x - this.svgOffsetAsGraphCoords.x,
      bottom: this.svgCoordToGraphCoord(new SvgCoordinate(0, this.svgElement.clientHeight)).y - this.svgOffsetAsGraphCoords.y,
      left: this.svgCoordToGraphCoord(new SvgCoordinate(0, 0)).x - this.svgOffsetAsGraphCoords.x
    };
  }

  setAxisNumbers() {
    const axisNumbers = {
      x: {
        positive: [] as string[],
        negative: [] as string[]
      },
      y: {
        positive: [] as string[],
        negative: [] as string[]
      }
    };
    for (let i = 1; i < this.svgSidesAsGraphCoords.right / +this.stepBetweenCoords; i++) {
      axisNumbers.x.positive.push(this.stepBetweenCoords.times(i).toString());
    }
    for (let i = -1; i > this.svgSidesAsGraphCoords.left / +this.stepBetweenCoords; i--) {
      axisNumbers.x.negative.push(this.stepBetweenCoords.times(i).toString());
    }
    for (let i = 1; i < this.svgSidesAsGraphCoords.top / +this.stepBetweenCoords; i++) {
      axisNumbers.y.positive.push(this.stepBetweenCoords.times(i).toString());
    }
    for (let i = -1; i > this.svgSidesAsGraphCoords.bottom / +this.stepBetweenCoords; i--) {
      axisNumbers.y.negative.push(this.stepBetweenCoords.times(i).toString());
    }
    this.axisNumbers = axisNumbers;
  }

  graphCoordToSvgCoord(coordinate: GraphCoordinate, useTransforms: boolean = true): SvgCoordinate {
    const convertedCoordinate = new GraphCoordinate(
      useTransforms ? this.svgMiddle.x + coordinate.x / +this.stepBetweenCoords * this.squareSize : this.svgMiddle.x + coordinate.x * this.squareSize,
      useTransforms ? this.svgMiddle.y - coordinate.y / +this.stepBetweenCoords * this.squareSize : this.svgMiddle.y - coordinate.y * this.squareSize
    );
    if (Math.abs(convertedCoordinate.y) === Infinity) {
      //? Infinity and MAX_SAFE_INTEGER didn't work with SVGs on some browsers, so I'll just use a really large number
      convertedCoordinate.y = convertedCoordinate.y < 0 ? -1_000_000_000 : 1_000_000_000;
    }
    return convertedCoordinate;
  }

  svgCoordToGraphCoord(coordinate: SvgCoordinate, useTransforms: boolean = true): GraphCoordinate {
    const convertedCoordinate = new SvgCoordinate(
      useTransforms ? (coordinate.x - this.svgMiddle.x) / this.squareSize * +this.stepBetweenCoords : (coordinate.x - this.svgMiddle.x) / this.squareSize,
      useTransforms ? -((coordinate.y - this.svgMiddle.y) / this.squareSize * +this.stepBetweenCoords) : -((coordinate.y - this.svgMiddle.y) / this.squareSize)
    );
    if (Math.abs(convertedCoordinate.y) === Infinity) {
      //? Infinity and MAX_SAFE_INTEGER didn't work with SVGs on some browsers, so I'll just use a really large number
      convertedCoordinate.y = convertedCoordinate.y < 0 ? -1_000_000_000 : 1_000_000_000;
    }
    return convertedCoordinate;
  }
}
