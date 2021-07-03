import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalVarsService } from 'src/app/global-vars.service';
import { Button } from '../../models/button.interface';

@Component({
  selector: 'app-calculator-menu',
  templateUrl: './calculator-menu.component.html',
  styleUrls: ['./calculator-menu.component.scss'],
})
export class CalculatorMenuComponent {
  items = {
    general: [
      {
        buttonName: 'Calculator',
        icon: {
          iconName: 'calculator-outline',
          iconPack: 'Ionicons'
        }
      },
      {
        buttonName: 'Charts',
        icon: {
          iconName: 'bar-chart-outline',
          iconPack: 'Ionicons'
        }
      },
      {
        buttonName: 'Graphing calculator',
        icon: {
          iconName: 'grid_on',
          iconPack: 'Material Design'
        }
      }
    ] as Button[],
    converters: [
      {
        buttonName: 'Length converter',
        icon: {
          iconName: 'square_foot',
          iconPack: 'Material Design'
        }
      },
      {
        buttonName: 'Mass converter',
        icon: {
          iconName: 'barbell-outline',
          iconPack: 'Ionicons'
        }
      },
      {
        buttonName: 'Temperature converter',
        icon: {
          iconName: 'thermometer-outline',
          iconPack: 'Ionicons'
        }
      },
      {
        buttonName: 'Currency converter',
        icon: {
          iconName: 'euro',
          iconPack: 'Material Design'
        }
      }
    ] as Button[]
  };

  filteredItems = { general: [...this.items.general], converters: [...this.items.converters] };

  constructor(private globals: GlobalVarsService, private router: Router) { }

  setFilteredItems() {
    this.filteredItems = { general: [...this.items.general], converters: [...this.items.converters] };
  }

  filterItems(event) {
    this.setFilteredItems();
    const value = event.target.value;
    if (value && value.trim() !== '') {
      this.filteredItems = {
        general: this.items.general.filter((item) => {
          return item.buttonName.toLowerCase().includes(value.toLowerCase());
        }),
        converters: this.items.converters.filter((item) => {
          return item.buttonName.toLowerCase().includes(value.toLowerCase());
        }),
      };
    }
  }

  setView(button: Button) {
    const route = '/' + button.buttonName.toLowerCase().replace(/ /, '-');
    this.router.navigate([route]);
    this.globals.currentCalculator = button.buttonName;
  }
}
