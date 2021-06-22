import Decimal from 'decimal.js';
import { Subject } from 'rxjs';
import { Coordinate } from './coordinate';

export class GraphingCalculatorSvgController {
  /**
   * The distances between the center of the svg and each side of the svg in svg units
   */
  svgSides = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  /**
   * The distances between the center of the svg and each side of the svg in coordinate system units
   */
  svgSidesAsCoordinates = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  svgMiddle = new Coordinate(0, 0);
  svgOffset = new Coordinate(0, 0);
  svgOffsetAsCoordinates = new Coordinate(0, 0);
  mousePosAsCoordinates = new Coordinate(0, 0);
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
  stepBetweenCoordinates = new Decimal(1); // Decimal.js is used to avoid floating point problems
  //  When zoomLevel is under stepRange.min, the step decreases. When zoomLevel is over stepRange.max, the step increases.
  private stepRange: { min: number, max: number; } = { min: 10, max: 20 };

  constructor(private svgElement: SVGElement) { }

  pan(event) {
    this.svgOffsetAsCoordinates.x += event.velocityX;
    this.svgOffsetAsCoordinates.y -= event.velocityY;
    this.svgOffset = this.convertCoordinatesToSvgCoordinates(this.svgOffsetAsCoordinates);
    this.setSvgSidesAsCoordinates();
    this.setAxisNumbers();
    this.svgTransformSubject.next();
  }

  zoom(amount: number) {
    this.zoomLevel += amount * +this.stepBetweenCoordinates;
    this.setStepBetweenCoordinates();
    this.setSvgSizeRelatedVars();
    this.svgTransformSubject.next();
  }

  setStepBetweenCoordinates() {
    const stepAsString: string = this.stepBetweenCoordinates.toFixed();
    const stepNumber: number = +stepAsString.replace(/0/g, '').replace(/\./g, ''); // The number without the zeroes, can be 1, 2 or 5
    const stepSplitAtDot: string[] = stepAsString.split('.'); // Used for checking if the value includes decimals
    const stepMultiplier = new Decimal(stepSplitAtDot.length === 1
      ? '1' + stepSplitAtDot[0].slice(1)
      : '0.' + stepSplitAtDot[1].slice(0, stepSplitAtDot[1].length - 1) + '1'); // The multiplier, like 1, 10, 10000, 0.1, 0.01 etc.

    // Default values that will be used if the zoomLevel isn't in the range
    let newStep = this.stepBetweenCoordinates;
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
    this.stepBetweenCoordinates = newStep;
    this.stepRange = newRange;
  }

  onResize(delay?: number) {
    // Set delay only if necessary, such as for CSS transitions
    if (delay) {
      setTimeout(() => {
        this.setSvgSizeRelatedVars();
        this.svgTransformSubject.next();
      }, delay);
    } else {
      this.setSvgSizeRelatedVars();
      this.svgTransformSubject.next();
    }
  }

  setMousePos(e: MouseEvent) {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    this.mousePosAsCoordinates = this.convertSvgCoordinatesToCoordinates(new Coordinate(e.clientX - rect.left, e.clientY - rect.top));
  }

  setSvgSizeRelatedVars() {
    this.squareSize = this.svgElement.clientWidth / this.zoomLevel * +this.stepBetweenCoordinates;
    this.svgOffset = this.convertCoordinatesToSvgCoordinates(this.svgOffsetAsCoordinates);
    this.svgMiddle = {
      x: this.svgElement.clientWidth / 2,
      y: this.svgElement.clientHeight / 2
    };
    this.visibleGridSize = {
      width: this.svgElement.clientWidth / this.squareSize,
      height: this.svgElement.clientHeight / this.squareSize
    };
    this.setSvgSides();
    this.setSvgSidesAsCoordinates();
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

  setSvgSidesAsCoordinates() {
    this.svgSidesAsCoordinates = {
      top: this.convertSvgCoordinatesToCoordinates(new Coordinate(0, 0)).y - this.svgOffsetAsCoordinates.y,
      right: this.convertSvgCoordinatesToCoordinates(new Coordinate(this.svgElement.clientWidth, 0)).x - this.svgOffsetAsCoordinates.x,
      bottom: this.convertSvgCoordinatesToCoordinates(new Coordinate(0, this.svgElement.clientHeight)).y - this.svgOffsetAsCoordinates.y,
      left: this.convertSvgCoordinatesToCoordinates(new Coordinate(0, 0)).x - this.svgOffsetAsCoordinates.x
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
    for (let i = 1; i < this.svgSidesAsCoordinates.right; i++) {
      axisNumbers.x.positive.push(this.stepBetweenCoordinates.times(i).toString());
    }
    for (let i = -1; i > this.svgSidesAsCoordinates.left; i--) {
      axisNumbers.x.negative.push(this.stepBetweenCoordinates.times(i).toString());
    }
    for (let i = 1; i < this.svgSidesAsCoordinates.top; i++) {
      axisNumbers.y.positive.push(this.stepBetweenCoordinates.times(i).toString());
    }
    for (let i = -1; i > this.svgSidesAsCoordinates.bottom; i--) {
      axisNumbers.y.negative.push(this.stepBetweenCoordinates.times(i).toString());
    }
    this.axisNumbers = axisNumbers;
  }

  /**
 * Converts the given coordinate system coordinates to svg coordinates.
 * @param coordinate An object with the x and y coordinates that the function should convert to svg coordinates
 */
  convertCoordinatesToSvgCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate = new Coordinate(
      this.svgMiddle.x + (coordinate.x * this.squareSize),
      this.svgMiddle.y - (coordinate.y * this.squareSize)
    );
    // Svgs can't handle Infinity, so return MAX_SAFE_INTEGER if it is Infinity
    if (Math.abs(convertedCoordinate.y) === Infinity) {
      convertedCoordinate.y = convertedCoordinate.y < 0 ? -Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    }
    return convertedCoordinate;
  }

  /**
   * Converts the given svg coordinates to coordinate system coordinates.
   * @param coordinate An object with the x and y coordinates that the function should convert to coordinate system coordinates
   */
  convertSvgCoordinatesToCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate = new Coordinate(
      (coordinate.x <= 0 ? -coordinate.x : coordinate.x / this.squareSize) - this.visibleGridSize.width * 0.5,
      -((coordinate.y / this.squareSize) - this.visibleGridSize.height * 0.5)
    );
    return convertedCoordinate;
  }
}
