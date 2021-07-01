import { GraphStyle } from ".";
import { Graph } from "./graph";

interface PointStyle extends GraphStyle {
  radius: string | number;
}

export class Point extends Graph {
  get equation(): string {
    return this._equation;
  }
  set equation(value: string) {
    this._equation = value;
    this.x = this.equation.split(',')[0]?.replace(/[^\d.,-]/g, '') || '0';
    this.y = this.equation.split(',')[1]?.replace(/[^\d.,-]/g, '') || '0';
  }
  //? String to avoid potential floating point problems
  x: string;
  y: string;

  constructor(protected _equation: string, public style: PointStyle) {
    super('Point', _equation, style);
    this.x = '0';
    this.y = '0';
  }
}
