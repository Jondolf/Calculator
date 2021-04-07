import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MathEvaluatorService {
  private evalExpression: (expr: string) => number;
  private evalYValues: (expr: string, xValues: number[]) => Float64Array;

  constructor() {
    import('./pkg/math_evaluator').then(evaluator => { this.evalExpression = evaluator.eval_expr; this.evalYValues = evaluator.eval_y_values; });
  }

  evaluate(expr: string, forceDeg: boolean): number {
    try {
      const result = this.evalExpression(this.formatExprForEvaluation(expr.replace(/x/g, '*').replace(/÷/g, '/'), forceDeg));
      return result;
    } catch (_) {
      return NaN;
    }
  }

  evaluateYValues(expr: string, xValues: number[]): number[] {
    try {
      const yValues = Array.from(
        this.evalYValues(
          this.formatExprForEvaluation(
            expr
              .replace(/÷/g, '/')
              .replace(/(sin|cos|tan|lb|lg|ln|sqrt)(([\dπexy]|pi)+)/g, '$1($2)')
              .replace(/([\)0-9πexy]|pi)(%)/g, '($1/100)')
              .replace(/([\)0-9πexy]|pi)([\(πexy]|pi|sin|cos|tan|lb|lg|ln|√|sqrt)/g, '$1*$2')
              .replace(/([\)πexy]|pi)([\(0-9πexy]|pi)/g, '$1*$2'),
            false),
          xValues
        ));
      return yValues;
    } catch (_) {
      return [];
    }
  }

  evaluateAndFormat(expr: string, forceDeg: boolean): string {
    return this.toExponentialAtDecimalPlaces(this.limitDecimalPlaces(this.evaluate(expr, forceDeg), 10), 12);
  }

  private formatExprForEvaluation(expr: string, forceDeg: boolean): string {
    let formattedExpr = expr
      .replace(/√/g, 'sqrt')
      .replace(/π/g, 'pi')
      .replace(/([\)0-9exy]|pi)([\(exy]|pi|sin|cos|tan|lb|lg|ln|sqrt)/g, '$1*$2')
      .replace(/([\)e]|pi)([\(0-9e]|pi)/g, '$1*$2')
      .replace(/([\)0-9e]|pi)(%)/g, '($1/100)')
      .replace(/mod/g, '%')
      .replace(/(sin|cos|tan|lb|lg|ln|sqrt)(([\de]|pi)+)/g, '$1($2)')
      .replace(/lg/g, 'log10')
      .trim();

    const openingParenCount = (formattedExpr.match(/\(/g) || []).length;
    const closingParenCount = (formattedExpr.match(/\)/g) || []).length;
    if (openingParenCount > closingParenCount) {
      formattedExpr = formattedExpr + ')'.repeat(openingParenCount - closingParenCount);
    }

    // Force all trigonometric functions to use degrees instead of radians
    if (forceDeg) {
      formattedExpr = formattedExpr.replace(/sin/g, 'sind').replace(/cos/g, 'cosd').replace(/tan/g, 'tand'); // Degree versions
    }

    return formattedExpr;
  }

  private limitDecimalPlaces = (num: number, places: number): number => Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
  private toExponentialAtDecimalPlaces = (num: number, places: number): string => num.toString().split('.')[0].length >= places ? num.toExponential() : num.toString();
}