import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-fullscreen-container',
  templateUrl: './fullscreen-container.component.html',
  styleUrls: ['./fullscreen-container.component.scss']
})
export class FullscreenContainerComponent implements OnInit {
  @Input() backgroundRgb: string; // Colon seperated list, like 255, 255, 255
  @Input() backgroundAlpha: number | string;
  backgroundColor: string;

  ngOnInit() {
    this.backgroundColor = this.getBackgroundColor();
  }

  getBackgroundColor() {
    const bgRgb = this.backgroundRgb ? this.backgroundRgb : 'var(--ion-color-primary-rgb)';
    const bgAlpha = this.backgroundAlpha ? this.backgroundAlpha : '0.8';
    return `rgba(${bgRgb}, ${bgAlpha})`;
  }
}
