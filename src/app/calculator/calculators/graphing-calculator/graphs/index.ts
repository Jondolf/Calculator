import { Graph } from "./graph";
import { Line } from "./line";
import { Point } from "./point";

type GraphType = 'Line' | 'Point';

interface GraphStyle {
  stroke: string;
  strokeWidth: string | number;
  fill: string;
  [custom: string]: any;
}

export {
  GraphStyle,
  GraphType,
  Graph,
  Line,
  Point
};

