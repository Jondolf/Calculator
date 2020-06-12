import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-more-commands-menu',
  templateUrl: './more-commands-menu.component.html',
  styleUrls: ['./more-commands-menu.component.scss']
})
export class MoreCommandsMenuComponent {
  @Input() gridSize: string;
  @Output() addSymbolToCalculation = new EventEmitter();

  menuOpen = false;
}
