import { Component, Output, EventEmitter } from '@angular/core';
import { Button } from 'src/app/models/button.interface';

@Component({
  selector: 'app-themes',
  templateUrl: './themes.component.html',
  styleUrls: ['./themes.component.scss']
})
export class ThemesComponent {
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
        fontColor: '225, 225, 225',
        margin: '0 0 10px 0'
      }
    }];
  lighThemeClasses: string[] = ['light default-light', 'light solarized-light', 'light pure-white'];
  darkThemeClasses: string[] = ['dark default-dark', 'dark solarized-dark', 'dark palenight', 'dark pure-black'];

  changeTheme(themeClassName: string) {
    document.body.className = themeClassName;
  }
}
