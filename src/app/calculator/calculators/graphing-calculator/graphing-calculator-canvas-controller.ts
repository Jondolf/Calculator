import { Coordinate } from 'src/app/models/coordinate.interface';

export class GraphingCalculatorCanvasController {
  canvasHalf: Coordinate = { x: 0, y: 0 };
  /**
   * The distances between the center of the canvas and each side of the canvas in coordinate system units
   */
  canvasSides = {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  };
  canvasOffset: Coordinate = { x: 0, y: 0 }; // Used for panning
  scale = 10; // How many squares displayed on the x-axis
  amountOfSquares: { x: number, y: number };
  squareSize = 0;

  constructor(private canvasElement: HTMLCanvasElement) { }

  pan(event: HammerInput): void {
    this.canvasOffset = {
      x: this.canvasOffset.x + event.velocityX * (0.2 + this.scale * 0.1),
      y: this.canvasOffset.y - event.velocityY * (0.2 + this.scale * 0.1)
    };
    this.setCanvasSides();
  }

  zoom(amount: number): void {
    this.scale = Math.round(this.scale * amount);
    this.setCanvasSizeRelatedVars();
  }

  handleSetCanvasSize(delay?: number) {
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

  setCanvasSize() {
    this.canvasElement.width = this.canvasElement.height *
      (this.canvasElement.clientWidth / this.canvasElement.clientHeight);
  }

  setCanvasSizeRelatedVars(): void {
    this.squareSize = this.canvasElement.width / this.scale;
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

  setCanvasSides() {
    this.canvasSides = {
      top: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).y,
      bottom: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: this.canvasElement.height }).y,
      left: this.convertCanvasCoordinatesToCoordinates({ x: 0, y: 0 }).x,
      right: this.convertCanvasCoordinatesToCoordinates({ x: this.canvasElement.width, y: 0 }).x
    };
  }

  /**
   * Converts the given coordinate system coordinates to canvas coordinates
   * @param coordinate An object with the x and y coordinates that the function should convert to canvas coordinates
   */
  convertCoordinatesToCanvasCoordinates(coordinate: Coordinate): Coordinate {
    const convertedCoordinate: Coordinate = {
      x: this.canvasHalf.x + (coordinate.x * this.squareSize),
      y: this.canvasHalf.y - (coordinate.y * this.squareSize)
    };
    if (Math.abs(convertedCoordinate.y) === Infinity) {
      convertedCoordinate.y = convertedCoordinate.y < 0 ? -Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
    }
    return convertedCoordinate;
  }

  /**
   * Converts the given canvas coordinates to coordinate system coordinates
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
