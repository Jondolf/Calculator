import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  constructor(public location: Location, public globals: GlobalVarsService) { }

  ngOnInit() {
    this.globals.isInSettings = true;
  }
}
