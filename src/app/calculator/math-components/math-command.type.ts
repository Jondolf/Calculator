import { MathButton } from "./math-buttons/math-buttons.component";

export type MathCommand = {
  shortcuts: string[];
  command: ([args]: any) => any;
  commandArgs?: any[];
  button?: MathButton;
};
