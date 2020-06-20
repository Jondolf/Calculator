import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Button } from 'src/app/models/button.interface';
import { Location } from '@angular/common';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.page.html',
  styleUrls: ['./themes.page.scss']
})
export class ThemesPage implements OnInit {
  @Output() closeThemesMenu = new EventEmitter();

  lightThemes: Button[] = [
    {
      buttonName: 'Default light',
      icon: {},
      styles: {
        backgroundRgb: '245, 245, 245',
        backgroundAlpha: '1',
        fontColor: '#000000',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Solarized light',
      icon: {},
      styles: {
        backgroundRgb: '238,232,213',
        backgroundAlpha: '1',
        fontColor: '#435156',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Pure white',
      icon: {},
      styles: {
        backgroundRgb: '255, 255, 255',
        backgroundAlpha: '1',
        fontColor: '#1e1e1e'
      }
    }
  ];
  darkThemes: Button[] = [
    {
      buttonName: 'Default dark',
      icon: {},
      styles: {
        backgroundRgb: '57, 62, 70',
        backgroundAlpha: '1',
        fontColor: '#ffffff',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Solarized dark',
      icon: {},
      styles: {
        backgroundRgb: '7, 54, 66',
        backgroundAlpha: '1',
        fontColor: '#acb7b9',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Palenight',
      icon: {},
      styles: {
        backgroundRgb: '41, 45, 62',
        backgroundAlpha: '1',
        fontColor: '#a6accd',
        margin: '0 0 10px 0'
      }
    },
    {
      buttonName: 'Pure black',
      icon: {},
      styles: {
        backgroundRgb: '0, 0, 0',
        backgroundAlpha: '1',
        fontColor: '#e1e1e1',
        margin: '0 0 10px 0'
      }
    }];
  lighThemeClasses: string[] = ['light default-light', 'light solarized-light', 'light pure-white'];
  darkThemeClasses: string[] = ['dark default-dark', 'dark solarized-dark', 'dark palenight', 'dark pure-black'];

  constructor(public statusBar: StatusBar, public location: Location, public globals: GlobalVarsService, private storage: Storage) { }

  ngOnInit() {
    this.globals.isInSettings = true;
  }

  changeTheme(themeClassName: string) {
    document.body.className = themeClassName;
    this.globals.currentTheme = themeClassName;
    this.storage.set('theme', this.globals.currentTheme);
    this.globals.currentThemeChange.next(this.globals.currentTheme);
    this.setStatusBarColors();
  }

  setStatusBarColors() {
    if (document.body.className.includes('light')) {
      this.statusBar.backgroundColorByName('white');
      this.statusBar.styleDefault();
    } else {
      this.statusBar.backgroundColorByName('black');
      this.statusBar.styleLightContent();
    }
  }
}
