import { Component, OnInit, Input } from '@angular/core';
import { Button } from 'src/app/models/button.interface';

@Component({
  selector: 'app-wide-button',
  templateUrl: './wide-button.component.html',
  styleUrls: ['./wide-button.component.scss']
})
export class WideButtonComponent implements OnInit {
  @Input() button: Button;
  @Input() backgroundColor: string;

  ngOnInit() {
    if (this.button.styles.backgroundRgb && this.button.styles.backgroundAlpha) {
      this.backgroundColor = this.getBackgroundColor();
    }
  }

  getBackgroundColor(): string {
    const bgRgb = this.button.styles.backgroundRgb ? this.button.styles.backgroundRgb : 'var(--ion-color-primary-rgb)';
    const bgAlpha = this.button.styles.backgroundAlpha ? this.button.styles.backgroundAlpha : '0.75';
    return `rgba(${bgRgb}, ${bgAlpha})`;
  }
}
