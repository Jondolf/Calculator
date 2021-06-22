import { GraphStyle, GraphType } from ".";

export abstract class Graph {
  get equation(): string {
    return this._equation;
  }
  set equation(value: string) {
    this._equation = value;
  }

  constructor(public type: GraphType, protected _equation: string, public style: GraphStyle) { }

  destroy(): void { }
}
