import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-more-commands-menu',
  templateUrl: './more-commands-menu.component.html',
  styleUrls: ['./more-commands-menu.component.scss']
})
export class MoreCommandsMenuComponent {
  @Output() addSymbolToCalculation = new EventEmitter();

  menuOpen = false;
}
