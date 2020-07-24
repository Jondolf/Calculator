import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Button } from '../../models/button.interface';
import { GlobalVarsService } from 'src/app/global-vars.service';

@Component({
  selector: 'app-calculator-menu-modal',
  templateUrl: './calculator-menu-modal.component.html',
  styleUrls: ['./calculator-menu-modal.component.scss'],
})
export class CalculatorMenuModalComponent {
  items = {
    general: [
      {
        buttonName: 'Calculator',
        icon: {
          iconName: 'calculator',
          iconPack: 'Ionicons'
        }
      },
      {
        buttonName: 'Charts',
        icon: {
          iconName: 'bar-chart',
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
          iconName: 'barbell',
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

  constructor(private modalCtrl: ModalController) { }

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

  dismissModal(message?): void {
    this.modalCtrl.dismiss(message ? { message } : null);
  }
}
