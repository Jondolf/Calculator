import { Coordinate } from 'src/app/models/coordinate.interface';
import Decimal from 'decimal.js';

export class GraphingCalculatorCanvasController {
  /**
   * The distances between the center of the canvas and each side of the canvas in coordinate system units
   */
  canvasSides = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  canvasHalf: Coordinate = { x: 0, y: 0 };
  canvasOffset: Coordinate = { x: 0, y: 0 };
  zoomLevel = 10;
  amountOfSquares: { x: number, y: number };
  squareSize = 0;

  stepBetweenCoordinates = new Decimal(1); // Decimal.js is used to avoid floating point problems

  //  When zoomLevel is under stepRange.min, the step decreases. When zoomLevel is over stepRange.max, the step increases.
  private stepRange: { min: number, max: number } = { min: 10, max: 20 };

  constructor(private canvasElement: HTMLCanvasElement) { }

  pan(event): void {
    this.canvasOffset = {
      x: this.canvasOffset.x + event.velocityX * (this.squareSize * 0.0075),
      y: this.canvasOffset.y - event.velocityY * (this.squareSize * 0.0075)
    };
    this.setCanvasSides();
  }

  zoom(amount: number): void {
    this.zoomLevel += amount * +this.stepBetweenCoordinates;
    this.setStepBetweenCoordinates();
    this.setCanvasSizeRelatedVars();
  }

  private setStepBetweenCoordinates(): void {
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

  handleSetCanvasSize(delay?: number): void {
    // Set delay only if necessary, such as for CSS transitions
    if (delay) {
      setTimeout(() => {
        this.setCanvasSize();
        this.setCanvasSizeRelatedVars();
      }, delay);
    } else {
      this.setCanvasSize();
      this.setCanvasSizeRelatedVars();
    }
  }

  private setCanvasSize(): void {
    this.canvasElement.width = this.canvasElement.height *
      (this.canvasElement.clientWidth / this.canvasElement.clientHeight);
  }

  private setCanvasSizeRelatedVars(): void {
    this.squareSize = this.canvasElement.width / this.zoomLevel * +this.stepBetweenCoordinates;
    this.canvasHalf = {
      x: this.canvasElement.width / 2,
      y: this.canvasElement.height / 2
    };
    this.amountOfSquares = {
      x: this.canvasElement.width / this.squareSize,
      y: this.canvasElement.height / this.squareSize
    };
    this.setCanvasSides();
  }

  private setCanvasSides(): void {
    this.canvasSides = {
      top: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).y,
      bottom: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: this.canvasElement.height }).y,
      left: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).x,
      right: this.convertCanvasCoordinatesToCoordinates({ x: this.canvasElement.width, y: 0 }).x
    };
  }

  /**
   * Converts the given coordinate system coordinates to canvas coordinates.
   * @param coordinate An object with the x and y coordinates that the function should convert to canvas coordinates
   */
  convertCoordinatesToCanvasCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: this.canvasHalf.x + (coordinate.x * this.squareSize),
      y: this.canvasHalf.y - (coordinate.y * this.squareSize)
    };
    // Canvas can't handle Infinity, so return MAX_SAFE_INTEGER if it is Infinity
    if (Math.abs(convertedCoordinate.y) === Infinity) {
      convertedCoordinate.y = convertedCoordinate.y < 0 ? -Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    }
    return convertedCoordinate;
  }

  /**
   * Converts the given canvas coordinates to coordinate system coordinates.
   * @param coordinate An object with the x and y coordinates that the function should convert to coordinate system coordinates
   */
  convertCanvasCoordinatesToCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: (coordinate.x <= 0 ? -coordinate.x : coordinate.x / this.squareSize) - this.amountOfSquares.x * 0.5,
      y: -((coordinate.y / this.squareSize) - this.amountOfSquares.y * 0.5)
    };
    return convertedCoordinate;
  }
}
