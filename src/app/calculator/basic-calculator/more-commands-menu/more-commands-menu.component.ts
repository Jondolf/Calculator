import { Component } from '@angular/core';

@Component({
  selector: 'app-more-commands-menu',
  templateUrl: './more-commands-menu.component.html',
  styleUrls: ['./more-commands-menu.component.scss']
})
export class MoreCommandsMenuComponent {
  menuOpen = false;
  log(e?: Event) {
    console.log('Event', e);
  }
}
