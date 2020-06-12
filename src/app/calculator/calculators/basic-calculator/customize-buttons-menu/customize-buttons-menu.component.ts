import { Component, Output, EventEmitter, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-customize-buttons-menu',
  templateUrl: './customize-buttons-menu.component.html',
  styleUrls: ['./customize-buttons-menu.component.scss'],
})
export class CustomizeButtonsMenuComponent implements OnInit, OnChanges {
  @Input() currentStyles;
  @Output() closeMenu = new EventEmitter();
  @Output() stylesChange = new EventEmitter();
  @Output() resetToDefaults = new EventEmitter();

  styles = {
    gridSize: 'small',
    gridGap: '0px',
    buttonStyles: {
      'border-radius': '0px',
      'border-width': '1px'
    }
  };

  ngOnInit() {
    this.styles = this.currentStyles;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.currentStyles.previousValue !== changes.currentStyles.currentValue) {
      this.styles = changes.currentStyles.currentValue;
    }
  }

  updateStyles(event: Event): void {
    this.stylesChange.emit({ event, styles: this.styles });
  }

  pixelsToNumber(pixelString: string): number {
    return +pixelString.slice(0, -2);
  }
}
