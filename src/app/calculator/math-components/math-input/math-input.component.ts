import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MathCommand } from '../math-command.type';

@Component({
  selector: 'app-math-input',
  templateUrl: './math-input.component.html',
  styleUrls: ['./math-input.component.scss']
})
export class MathInputComponent implements AfterViewInit {
  @ViewChild('mathInput') private mathInputRef: ElementRef;
  mathInput: HTMLInputElement;

  @Input() commands: MathCommand[];
  @Input() initialExpr: string;
  @Input() placeholder: string;
  @Input() eval: (expr: string) => number | string;
  @Input() isInversed: boolean;
  @Input() isHyperbolic: boolean;
  @Input() customOperatorSymbols: {
    plus?: string;
    minus?: string;
    multiply?: string;
    divide?: string;
    percent?: string;
    power?: string;
    modulo?: string;
  };
  @Output() exprChange = new EventEmitter<string>();

  private _expr = '';
  get expr(): string {
    return this._expr;
  }
  set expr(value) {
    this._expr = value;
    this.exprChange.emit(value);
  }
  get exprWithCustomOperatorSymbols(): string {
    const exprWithCustomOperators = this.customOperatorSymbols ? this._expr
      .replace(/\+/g, this.customOperatorSymbols.plus || '+')
      .replace(/-/g, this.customOperatorSymbols.minus || '-')
      .replace(/\*/g, this.customOperatorSymbols.multiply || '*')
      .replace(/\//g, this.customOperatorSymbols.divide || '/')
      .replace(/%/g, this.customOperatorSymbols.percent || '%')
      .replace(/\^/g, this.customOperatorSymbols.power || '^')
      .replace(/mod/g, this.customOperatorSymbols.modulo || 'mod') : this._expr;
    return exprWithCustomOperators;
  }

  private binaryOperators = ['+', '-', '*', '/', '%', '^', 'mod'];
  private mathFunctions = ['sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sinh', 'cosh', 'tanh', 'asinh', 'acosh', 'atanh', 'lb', 'ln', 'lg'];

  private selectionStart = this.expr.length;
  private selectionEnd = this.expr.length;

  constructor() { }

  ngAfterViewInit() {
    this.mathInput = this.mathInputRef.nativeElement;
    if (this.initialExpr) {
      this.expr = this.initialExpr;
    }
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.key === 'ArrowLeft') {
      if (e.shiftKey) {
        setTimeout(() => {
          if (this.mathInput.selectionDirection === 'backward') {
            const selStartPrevTermRange = this.getPrevTermRangeForIndex(this.selectionStart);
            this.setSelection(!isNaN(selStartPrevTermRange.start) ? selStartPrevTermRange.start : this.mathInput.selectionStart, this.mathInput.selectionEnd);
          } else {
            const selEndPrevTermRange = this.getPrevTermRangeForIndex(this.selectionEnd);
            this.setSelection(this.mathInput.selectionStart, !isNaN(selEndPrevTermRange.start) ? selEndPrevTermRange.start : this.mathInput.selectionEnd);
          }
        }, 0);
        return;
      }
      e.preventDefault();
      if (this.selectionStart !== this.selectionEnd) {
        this.collapseSelection(this.getSelection().start);
      } else {
        this.collapseSelectionToPrevTerm();
      }
      return;
    } else if (e.key === 'ArrowRight') {
      if (e.shiftKey) {
        setTimeout(() => {
          if (this.mathInput.selectionDirection === 'backward') {
            const selStartNextTermRange = this.getNextTermRangeForIndex(this.selectionStart);
            this.setSelection(!isNaN(selStartNextTermRange.end) ? selStartNextTermRange.end : this.mathInput.selectionStart, this.mathInput.selectionEnd);
          } else {
            const selEndNextTermRange = this.getNextTermRangeForIndex(this.selectionEnd);
            this.setSelection(this.mathInput.selectionStart, !isNaN(selEndNextTermRange.end) ? selEndNextTermRange.end : this.mathInput.selectionEnd);
          }
        }, 0);
        return;
      }
      e.preventDefault();
      if (this.selectionStart !== this.selectionEnd) {
        this.collapseSelection(this.getSelection().end);
      } else {
        this.collapseSelectionToNextTerm();
      }
      return;
    }
    if (e.ctrlKey && e.key === 'x') {
      e.preventDefault();
      navigator.clipboard.writeText(this.expr.slice(this.getSelection().start, this.getSelection().end))
        .then(() => {
          this.removeSection(this.getSelection().start, this.getSelection().end);
          this.collapseSelection(this.mathInput.selectionStart);
        });
      return;
    }
    if (e.ctrlKey && e.key === 'v') {
      e.preventDefault();
      navigator.clipboard.readText()
        .then(text => {
          this.paste(text);
        });
      return;
    }
    if (e.ctrlKey && e.key === 'a') {
      return;
    }
    if (e.ctrlKey || e.key === ' ') {
      return;
    }

    e.preventDefault();

    setTimeout(() => {
      this.selectionStart = this.getSelection().start;
      this.selectionEnd = this.getSelection().end;

      if (this.expr[this.selectionStart] === '=') {
        this.setSelection(this.selectionStart + 1, this.selectionEnd + 1);
      }
      if (e.key === 'Backspace') {
        this.deletePrev();
      } else if (e.key === 'Delete') {
        this.deleteNext();
      } else if (e.key === 'Escape') {
        this.resetCalculation();
      } else {
        const shortcut = e.key;
        const command = this.commands.find(command => command.shortcuts.includes(shortcut));
        if (command) {
          command.command(command.commandArgs);
        }
      }
      this.mathInput.focus();
    }, 0);
  };

  onPaste(e: ClipboardEvent) {
    const text = e.clipboardData.getData('text/plain');
    e.preventDefault();
    this.paste(text);
  }

  paste(text: string) {
    let exprWithPasted = '';
    if (this.expr[0] === '=') {
      if (this.expr === '=NaN' || '0123456789πe'.includes(text.toString())) {
        exprWithPasted = this.expr.slice(0, this.selectionStart) + text.toString() + this.expr.slice(this.selectionEnd);
      } else if (this.mathFunctions.includes(text.toString())) {
        exprWithPasted = `${text}(${this.expr.slice(1, this.selectionStart) + this.expr.slice(this.selectionEnd)})`;
      } else {
        exprWithPasted = this.expr.replace(/ /g, '');
        exprWithPasted = this.expr.slice(1, this.selectionStart) + text.toString() + this.expr.slice(this.selectionEnd);
      }
    } else {
      exprWithPasted = this.expr.slice(0, this.selectionStart) + text.toString() + this.expr.slice(this.selectionEnd);
    }
    if (!isNaN(+this.eval(exprWithPasted))) {
      if (this.expr[0] === '=') {
        if (this.expr === '=NaN' || '0123456789πe'.includes(text)) {
          this.resetCalculation();
          this.expr = this.expr.slice(0, this.selectionStart) + text + this.expr.slice(this.selectionEnd);
          this.collapseSelection(this.expr.length);
          return;
        } else if (this.mathFunctions.includes(text)) {
          this.expr = `${text}(${this.expr.slice(1, this.selectionStart) + this.expr.slice(this.selectionEnd)})`;
          this.collapseSelection(this.expr.length);
          return;
        } else {
          this.expr = this.expr.replace(/ /g, '');
          this.expr = this.expr.slice(1, this.selectionStart) + text + this.expr.slice(this.selectionEnd);
          this.collapseSelection(this.selectionStart);
          return;
        }
      } else {
        this.expr = this.expr.slice(0, this.selectionStart) + text + this.expr.slice(this.selectionEnd);
        this.collapseSelection(this.selectionStart + text.length);
      }
    }
  }

  onCalculationMouseUp() {
    setTimeout(() => {
      if (this.mathInput.selectionStart === this.mathInput.selectionEnd) {
        this.collapseSelection(this.mathInput.selectionStart);
      } else {
        this.setSelection(this.mathInput.selectionStart, this.mathInput.selectionEnd);
      }
    }, 0);
  }

  getSelection(): { start: number, end: number; } {
    this.mathInput.focus();
    return { start: this.mathInput.selectionStart, end: this.mathInput.selectionEnd };
  }

  setSelection(start: number, end: number) {
    setTimeout(() => {
      if (this.expr[start] === '=') {
        start++;
        end++;
      }

      this.selectionStart = this.mathInput.selectionStart;
      this.selectionEnd = this.mathInput.selectionEnd;

      const selStartPrevTermRange = this.getPrevTermRangeForIndex(start);
      const selStartNextTermRange = this.getNextTermRangeForIndex(start);
      const selEndPrevTermRange = this.getPrevTermRangeForIndex(end);
      const selEndNextTermRange = this.getNextTermRangeForIndex(end);

      let newSelRange = {
        start: start >= 0 ? start : 0,
        end: end <= this.expr.length ? end : this.expr.length
      };
      if (!isNaN(selStartPrevTermRange.start) && !isNaN(selStartPrevTermRange.end) && start < selStartPrevTermRange.start + (selStartPrevTermRange.end - selStartPrevTermRange.start) / 2) {
        newSelRange.start = selStartPrevTermRange.start >= 0 ? selStartPrevTermRange.start : 0;
      } else if (!isNaN(selStartNextTermRange.start) && !isNaN(selStartNextTermRange.end) && start >= selStartNextTermRange.start + (selStartNextTermRange.end - selStartNextTermRange.start) / 2) {
        newSelRange.start = selStartNextTermRange.end <= this.expr.length ? selEndNextTermRange.end : this.expr.length;
      }
      if (!isNaN(selEndPrevTermRange.start) && !isNaN(selEndPrevTermRange.end) && end < selEndPrevTermRange.start + (selEndPrevTermRange.end - selEndPrevTermRange.start) / 2) {
        newSelRange.end = selEndPrevTermRange.start >= 0 ? selEndPrevTermRange.start : 0;
      } else if (!isNaN(selEndNextTermRange.start) && !isNaN(selEndNextTermRange.end) && end >= selEndNextTermRange.start + (selEndNextTermRange.end - selEndNextTermRange.start) / 2) {
        newSelRange.end = selEndNextTermRange.end <= this.expr.length ? selEndNextTermRange.end : this.expr.length;
      }

      this.mathInput.setSelectionRange(newSelRange.start, newSelRange.end, this.mathInput.selectionDirection);

      this.selectionStart = newSelRange.start;
      this.selectionEnd = newSelRange.end;
    }, 0);
  }

  collapseSelection(offset: number) {
    setTimeout(() => {
      if (this.expr[offset] === '=') {
        offset++;
      }

      const prevTermRange = this.getPrevTermRangeForIndex(offset);
      const nextTermRange = this.getNextTermRangeForIndex(offset);

      let newOffset = offset >= 0 ? (offset <= this.expr.length ? offset : this.expr.length) : 0;
      if (!isNaN(prevTermRange.start) && !isNaN(prevTermRange.end) && offset < prevTermRange.start + (prevTermRange.end - prevTermRange.start) / 2) { // If sel is in lower half of prev term range
        newOffset = prevTermRange.start >= 0 ? prevTermRange.start : 0;
      } else if (!isNaN(nextTermRange.start) && !isNaN(nextTermRange.end) && offset >= nextTermRange.start + (nextTermRange.end - nextTermRange.start) / 2) { // If sel is in middle or upper half of next term range
        newOffset = nextTermRange.end <= this.expr.length ? nextTermRange.end : this.expr.length;
      }

      this.mathInput.setSelectionRange(newOffset, newOffset);

      this.selectionStart = newOffset;
      this.selectionEnd = newOffset;
    }, 0);
  }

  collapseSelectionToPrevTerm() {
    const prevTermRange = this.getPrevTermRangeForIndex(this.selectionStart);
    this.collapseSelection(!isNaN(prevTermRange.start) ? prevTermRange.start : this.selectionStart - 1);
  }

  collapseSelectionToNextTerm() {
    const nextTermRange = this.getNextTermRangeForIndex(this.selectionEnd);
    this.collapseSelection(!isNaN(nextTermRange.end) ? nextTermRange.end : this.selectionEnd + 1);
  }

  addSymbolToExpr(symbol: string | number) {
    setTimeout(() => {
      this.selectionStart = this.getSelection().start;
      this.selectionEnd = this.getSelection().end;

      const symbolBeforeCaret = this.expr[this.mathInput.selectionStart - 1] || this.expr[this.mathInput.selectionStart];
      const symbolAfterCaret = this.expr[this.mathInput.selectionEnd + 1] || this.expr[this.mathInput.selectionEnd];

      // Don't allow operator as first symbol (except plus and minus symbols)
      if (['*', '/', '%', '^', 'mod', '!'].includes(symbol.toString()) && this.selectionStart === 0) {
        this.collapseSelection(this.selectionStart);
        return;
      }

      // Don't allow two operators in a row
      if (this.expr !== '' && this.binaryOperators.includes(symbol.toString()) && (this.binaryOperators.includes(symbolBeforeCaret) || this.binaryOperators.includes(symbolAfterCaret))) {
        if (this.selectionStart === 0) {
          this.expr = symbol.toString() + this.expr.slice(1);
          this.collapseSelection(this.selectionStart + 1);
        } else {
          this.expr = this.expr
            .slice(0, this.expr[this.selectionEnd - 1] ? this.selectionEnd - 1 : this.selectionEnd)
            + symbol.toString()
            + this.expr.slice(this.selectionEnd);
          this.collapseSelection(this.selectionStart);
        }
        return;
      }

      // Don't allow two decimal separators in a row
      if (symbol.toString() === '.' && symbolBeforeCaret === '.') {
        this.collapseSelection(this.selectionStart);
        return;
      }

      // Parentheses restrictions
      if (symbol === ')' && this.binaryOperators.includes(symbolBeforeCaret)) {
        this.collapseSelection(this.selectionStart);
        return;
      } else if (this.binaryOperators.includes(symbol.toString()) && symbolBeforeCaret === '(' && symbol !== '-') {
        this.collapseSelection(this.selectionStart);
        return;
      }

      // Calculate expr and if equals symbol is pressed
      if (symbol.toString() === '=') {
        if (this.expr[0] !== '=' && !isNaN(+this.eval(this.expr))) {
          this.expr = `=${this.eval(this.expr)}`;
          this.collapseSelection(this.expr.length);
        }
        return;
      }

      if (this.expr[0] === '=') {
        if ('0123456789πe'.includes(symbol.toString())) {
          this.resetCalculation();
          this.expr = this.expr.slice(0, this.selectionStart) + symbol.toString() + this.expr.slice(this.selectionEnd);
          this.collapseSelection(this.expr.length);
          return;
        } else if ([...this.mathFunctions, '√'].includes(symbol.toString())) {
          this.expr = `${symbol}(${this.expr.slice(1, this.selectionStart) + this.expr.slice(this.selectionEnd)})`;
          this.collapseSelection(this.expr.length);
          return;
        } else {
          this.expr = this.expr.replace(/ /g, '');
          this.expr = this.expr.slice(1, this.selectionStart) + symbol.toString() + this.expr.slice(this.selectionEnd);
          this.collapseSelection(this.selectionStart);
          return;
        }
      }

      // If symbol is opening parenthesis, wrap selection in parentheses
      if (symbol === '(' && this.selectionStart !== this.selectionEnd) {
        this.expr = this.expr.slice(0, this.selectionStart) + '(' + this.expr.slice(this.selectionStart, this.selectionEnd) + ')' + this.expr.slice(this.selectionEnd);
        this.collapseSelectionToNextTerm();
        return;
      }

      if ([...this.mathFunctions, '√'].includes(symbol.toString())) {
        if (this.selectionStart !== this.selectionEnd) {
          this.expr = `${this.expr.slice(0, this.selectionStart)}${symbol.toString()}(${this.expr.slice(this.selectionStart, this.selectionEnd)})${this.expr.slice(this.selectionEnd)}`;
        } else {
          this.expr = `${this.expr.slice(0, this.selectionStart)}${symbol.toString()}(${this.expr.slice(this.selectionEnd)}`;
        }
        this.collapseSelection(this.selectionEnd + symbol.toString().length + 1);
        return;
      }

      this.expr = this.expr.slice(0, this.selectionStart) + symbol.toString() + this.expr.slice(this.selectionEnd);
      this.collapseSelection(this.selectionStart + symbol.toString().length);
    }, 0);
  }

  deletePrev() {
    setTimeout(() => {
      this.selectionStart = this.getSelection().start;
      this.selectionEnd = this.getSelection().end;

      if (this.expr[0] === '=') {
        if (this.expr === '=NaN') {
          this.resetCalculation();
          return;
        }
        this.removeSection(0, 1); // Remove equals-symbol
        this.setSelection(this.selectionStart - 1, this.selectionEnd - 1);
        return;
      }

      const isCollapsed = this.selectionStart === this.selectionEnd;
      const isAtStart = this.selectionStart === 0;

      const prevTermRange = this.getPrevTermRangeForIndex(this.selectionStart);

      if (isCollapsed && this.expr[prevTermRange.end - 1] === '(' && this.expr[this.selectionEnd] === ')') {
        this.removeSection(prevTermRange.start, this.selectionEnd + 1);
        this.collapseSelection(prevTermRange.start);
        if (this.expr === '') {
          this.resetCalculation();
        }
        return;
      } else if (isCollapsed && this.expr[this.selectionStart - 1] === '(' && this.expr[this.selectionEnd] === ')') {
        this.removeSection(this.selectionStart - 1, this.selectionEnd + 1);
        this.collapseSelection(this.selectionStart - 1);
        if (this.expr === '') {
          this.resetCalculation();
        }
        return;
      }

      this.removeSection(isCollapsed && !isAtStart ? (!isNaN(prevTermRange.start) ? prevTermRange.start : this.selectionStart - 1) : this.selectionStart, this.selectionEnd);

      if (this.expr === '') {
        this.resetCalculation();
        return;
      }

      this.collapseSelection(isCollapsed && !isAtStart ? (!isNaN(prevTermRange.start) ? prevTermRange.start : this.selectionStart - 1) : this.selectionStart);
    }, 0);
  }

  deleteNext() {
    setTimeout(() => {
      this.selectionStart = this.getSelection().start;
      this.selectionEnd = this.getSelection().end;

      if (this.expr[0] === '=') {
        if (this.expr === '=NaN') {
          this.resetCalculation();
          return;
        }
        this.removeSection(0, 1); // Remove equals-symbol
        this.setSelection(this.selectionStart - 1, this.selectionEnd - 1);
        return;
      }

      const isCollapsed = this.selectionStart === this.selectionEnd;
      const isAtEnd = this.selectionEnd === this.expr.length;

      const nextTermRange = this.getNextTermRangeForIndex(this.selectionEnd);

      this.removeSection(this.selectionStart, isCollapsed && !isAtEnd ? (!isNaN(nextTermRange.end) ? nextTermRange.end : this.selectionEnd + 1) : this.selectionEnd);

      if (this.expr === '') {
        this.resetCalculation();
        return;
      }

      this.collapseSelection(this.selectionStart);
    }, 0);
  }

  private getPrevTermRangeForIndex(index: number): { start: number; end: number; } {
    const sixCharTermRange = this.getSliceRangeFromString(this.expr, ['asinh(', 'acosh(', 'atanh('], index - 6, index);
    const fiveCharTermRange = this.getSliceRangeFromString(this.expr, ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tan('], index - 5, index);
    const fourCharTermRange = this.getSliceRangeFromString(this.expr, ['sin(', 'cos(', 'tan('], index - 4, index);
    const threeCharTermRange = this.getSliceRangeFromString(this.expr, ['lb(', 'ln(', 'lg(', 'mod'], index - 3, index);
    const twoCharTermRange = this.getSliceRangeFromString(this.expr, ['√('], index - 2, index);
    if (!isNaN(sixCharTermRange.end) && !isNaN(sixCharTermRange.end)) {
      return sixCharTermRange;
    } else if (!isNaN(fiveCharTermRange.end) && !isNaN(fiveCharTermRange.end)) {
      return fiveCharTermRange;
    } else if (!isNaN(fourCharTermRange.end) && !isNaN(fourCharTermRange.end)) {
      return fourCharTermRange;
    } else if (!isNaN(threeCharTermRange.end) && !isNaN(threeCharTermRange.end)) {
      return threeCharTermRange;
    } else if (!isNaN(twoCharTermRange.start) && !isNaN(twoCharTermRange.start)) {
      return twoCharTermRange;
    }
    return { start: NaN, end: NaN };
  }

  private getNextTermRangeForIndex(index: number): { start: number; end: number; } {
    const sixCharTermRange = this.getSliceRangeFromString(this.expr, ['asinh(', 'acosh(', 'atanh('], index - 5, index + 1);
    const fiveCharTermRange = this.getSliceRangeFromString(this.expr, ['asin(', 'acos(', 'atan(', 'sinh(', 'cosh(', 'tanh('], index - 4, index + 1);
    const fourCharTermRange = this.getSliceRangeFromString(this.expr, ['sin(', 'cos(', 'tan('], index - 3, index + 1);
    const threeCharTermRange = this.getSliceRangeFromString(this.expr, ['lb(', 'ln(', 'lg(', 'mod'], index - 2, index + 1);
    const twoCharTermRange = this.getSliceRangeFromString(this.expr, ['√('], index - 1, index + 1);
    if (!isNaN(sixCharTermRange.end) && !isNaN(sixCharTermRange.end)) {
      return sixCharTermRange;
    } else if (!isNaN(fiveCharTermRange.end) && !isNaN(fiveCharTermRange.end)) {
      return fiveCharTermRange;
    } else if (!isNaN(fourCharTermRange.end) && !isNaN(fourCharTermRange.end)) {
      return fourCharTermRange;
    } else if (!isNaN(threeCharTermRange.end) && !isNaN(threeCharTermRange.end)) {
      return threeCharTermRange;
    } else if (!isNaN(twoCharTermRange.start) && !isNaN(twoCharTermRange.start)) {
      return twoCharTermRange;
    }
    return { start: NaN, end: NaN };
  }

  private getSliceRangeFromString(str: string, targetSlices: string | string[], start: number, end: number): { start: number; end: number; } {
    let sliceStart = start;
    let sliceEnd = end;
    while (sliceStart < end) {
      if (targetSlices.includes(str.slice(sliceStart, sliceEnd))) {
        return { start: sliceStart, end: sliceEnd };
      }
      sliceStart++;
      sliceEnd++;
    }
    return { start: NaN, end: NaN };
  }

  removeSection(start: number, end: number): string {
    const section = this.expr.slice(start, end);
    this.expr = this.expr.slice(0, start) + this.expr.slice(end);
    return section;
  }

  resetCalculation() {
    this.expr = '';
    this.collapseSelection(0);
  };
}
