import { Component } from '@angular/core';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-settings-modal',
  templateUrl: './settings-modal.component.html',
  styleUrls: ['./settings-modal.component.scss'],
})
export class SettingsModalComponent {
  constructor(public globals: GlobalVarsService) { }
}
